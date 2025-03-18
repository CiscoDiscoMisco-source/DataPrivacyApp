'use client';

import { useState, useEffect } from 'react';
import { Company } from '@/models/company';
import { Preference } from '@/models/preference';
import { User } from '@/models/user';
import dataService from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { ArrowLeft, Coins } from 'lucide-react';
import { NavBar } from '@/components/nav-bar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';

export default function CompanyPreferences({ params }: { params: { id: string } }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Preference[]>([]);
  const [globalPreferences, setGlobalPreferences] = useState<Preference[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [tokenCost, setTokenCost] = useState(0);
  const [cloneCost, setCloneCost] = useState(0);
  const { toast } = useToast();

  const loadData = () => {
    const companyData = dataService.getCompany(params.id);
    const companiesData = dataService.getCompanies().filter(c => c.id !== params.id);
    const preferencesData = dataService.getCompanyPreferences(params.id);
    const globalPrefs = dataService.getGlobalPreferences();
    const userData = dataService.getUser();
    
    if (companyData) {
      setCompany(companyData);
      setCompanies(companiesData);
      setPreferences(preferencesData);
      setGlobalPreferences(globalPrefs);
      setUser(userData);
    }
    
    setPendingChanges([]);
    setHasChanges(false);
    setTokenCost(0);
    setCloneCost(0);
    setLoading(false);
  };

  useEffect(() => {
    // Load initial data
    loadData();
    
    // Subscribe to preference changes
    const unsubscribe = dataService.subscribeToPreferenceChanges(() => {
      // Reload preferences when they change
      const updatedPreferences = dataService.getCompanyPreferences(params.id);
      const updatedGlobalPrefs = dataService.getGlobalPreferences();
      const updatedUser = dataService.getUser();
      setPreferences(updatedPreferences);
      setGlobalPreferences(updatedGlobalPrefs);
      setUser(updatedUser);
      setPendingChanges([]);
      setHasChanges(false);
      setTokenCost(0);
    });
    
    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, [params.id]);

  // Recalculate token cost whenever pending changes are updated
  useEffect(() => {
    if (pendingChanges.length > 0) {
      const cost = dataService.calculatePreferenceCost(pendingChanges);
      setTokenCost(cost);
    } else {
      setTokenCost(0);
    }
  }, [pendingChanges]);

  // Calculate clone cost when selected company changes
  useEffect(() => {
    if (selectedCompanyId && company) {
      // For simplicity, calculate based on data types count of the company
      const dataTypes = getDataTypes();
      const cost = dataTypes.length;
      setCloneCost(cost);
    } else {
      setCloneCost(0);
    }
  }, [selectedCompanyId, company]);

  const handleTogglePreference = (preference: Preference) => {
    const updatedPreference = {
      ...preference,
      allowed: !preference.allowed
    };

    // Add to pending changes
    const existingIndex = pendingChanges.findIndex(p => p.id === preference.id);
    const newPendingChanges = [...pendingChanges];
    
    if (existingIndex >= 0) {
      newPendingChanges[existingIndex] = updatedPreference;
    } else {
      newPendingChanges.push(updatedPreference);
    }
    
    setPendingChanges(newPendingChanges);
    setHasChanges(true);
    
    // Update local state for immediate feedback
    const updatedPreferences = preferences.map(p => 
      p.id === preference.id ? updatedPreference : p
    );
    setPreferences(updatedPreferences);
  };
  
  const handleSubmitChanges = () => {
    // Check if user has enough tokens
    if (!user || user.tokens < tokenCost) {
      toast({
        title: 'Not Enough Tokens',
        description: `You need ${tokenCost} tokens to make these changes. Visit the Token Store to purchase more.`,
        variant: 'destructive'
      });
      setShowConfirmDialog(false);
      return;
    }
    
    // Save all pending changes with token deduction
    const success = dataService.savePreferencesWithTokens(pendingChanges);
    
    if (success) {
      // Update user data
      const updatedUser = dataService.getUser();
      setUser(updatedUser);
      
      // Show toast notification
      toast({
        title: 'Preferences Updated',
        description: `${pendingChanges.length} preference(s) have been updated for ${company?.name}. ${tokenCost} tokens spent.`,
      });
      
      // Reset pending changes
      setPendingChanges([]);
      setHasChanges(false);
      setTokenCost(0);
    } else {
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your preferences.',
        variant: 'destructive'
      });
    }
    
    setShowConfirmDialog(false);
  };
  
  const handleDiscardChanges = () => {
    // Reload preferences to discard changes
    loadData();
  };

  const createOrUpdatePreference = (dataType: string, allowed: boolean) => {
    // Check if preference already exists
    const existingPref = preferences.find(p => p.dataType === dataType);
    
    if (existingPref) {
      if (existingPref.allowed !== allowed) {
        handleTogglePreference(existingPref);
      }
      return;
    }
    
    // Create new preference
    const newPreference: Preference = {
      id: `${params.id}-${dataType.replace(/\s+/g, '-').toLowerCase()}`,
      dataType,
      allowed,
      companyId: params.id
    };
    
    // Add to pending changes
    const newPendingChanges = [...pendingChanges, newPreference];
    setPendingChanges(newPendingChanges);
    setHasChanges(true);
    
    // Update local state for immediate feedback
    setPreferences([...preferences, newPreference]);
  };

  const handleClonePreferences = () => {
    if (!selectedCompanyId) {
      toast({
        title: 'Error',
        description: 'Please select a source to clone preferences from.',
        variant: 'destructive'
      });
      return;
    }

    setShowConfirmDialog(true);
  };
  
  const confirmClonePreferences = () => {
    // Check if user has enough tokens
    if (!user || user.tokens < cloneCost) {
      toast({
        title: 'Not Enough Tokens',
        description: `You need ${cloneCost} tokens to clone these preferences. Visit the Token Store to purchase more.`,
        variant: 'destructive'
      });
      setShowConfirmDialog(false);
      return;
    }
    
    // Spend tokens
    const success = dataService.spendTokens(cloneCost);
    
    if (!success) {
      toast({
        title: 'Not Enough Tokens',
        description: 'Failed to deduct tokens for the preference clone operation.',
        variant: 'destructive'
      });
      setShowConfirmDialog(false);
      return;
    }
    
    // Update user data
    const updatedUser = dataService.getUser();
    setUser(updatedUser);
    
    if (selectedCompanyId === 'global') {
      // Handle cloning from global preferences
      const globalPrefs = dataService.getGlobalPreferences();
      
      // Create company-specific preferences based on global preferences
      globalPrefs.forEach(globalPref => {
        const companyPref: Preference = {
          id: `${params.id}-${globalPref.dataType.replace(/\s+/g, '-').toLowerCase()}`,
          dataType: globalPref.dataType,
          allowed: globalPref.allowed,
          companyId: params.id
        };
        
        dataService.savePreference(companyPref);
      });
      
      toast({
        title: 'Global Preferences Applied',
        description: `Global preferences have been applied to ${company?.name}. ${cloneCost} tokens spent.`,
      });
    } else {
      // Clone preferences from another company
      dataService.clonePreferences(selectedCompanyId, params.id);
      
      // Show toast notification
      const sourceCompany = companies.find(c => c.id === selectedCompanyId);
      toast({
        title: 'Preferences Cloned',
        description: `Preferences from ${sourceCompany?.name} have been applied to ${company?.name}. ${cloneCost} tokens spent.`,
      });
    }
    
    // Clear selection
    setSelectedCompanyId('');
    setShowConfirmDialog(false);
    
    // Reload data
    loadData();
  };

  const getDataTypes = (): string[] => {
    if (!company) return [];
    
    // Only get data types from this company's policies
    // This ensures we only show preferences for data categories the company actually uses
    return company.dataSharingPolicies.map(policy => policy.dataType);
  };

  const getEffectivePreference = (dataType: string): {allowed: boolean, isGlobal: boolean} => {
    // Check for company-specific preference
    const companyPref = preferences.find(p => p.dataType === dataType);
    
    if (companyPref) {
      return { allowed: companyPref.allowed, isGlobal: false };
    }
    
    // Fall back to global preference
    const globalPref = globalPreferences.find(p => p.dataType === dataType);
    
    if (globalPref) {
      return { allowed: globalPref.allowed, isGlobal: true };
    }
    
    return { allowed: false, isGlobal: true };
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl">Loading preferences...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500">Company not found</p>
          <Button asChild variant="ghost" className="mt-4">
            <Link href="/">Back to Companies</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const changedPreferences = pendingChanges.length;
  const dataTypes = getDataTypes();
  const hasEnoughTokens = user ? user.tokens >= tokenCost : false;
  const hasEnoughTokensForClone = user ? user.tokens >= cloneCost : false;

  return (
    <>
      <NavBar />
      <main className="container mx-auto p-4">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href={`/companies/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Company Details
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{company.name} Preferences</h1>
          <p className="text-muted-foreground mt-2">
            Manage data sharing preferences specific to this company
          </p>
        </div>

        {hasChanges && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/30 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Pending Changes</h2>
              <p className="text-muted-foreground">
                You have {changedPreferences} unsaved preference change{changedPreferences !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 ${hasEnoughTokens ? 'text-green-600' : 'text-red-500'}`}>
                <Coins className="h-5 w-5" />
                <span className="font-bold">{tokenCost} Tokens</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleDiscardChanges}
                >
                  Discard
                </Button>
                <Button 
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={!hasEnoughTokens}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Sharing Preferences</CardTitle>
                <CardDescription>
                  Toggle preferences to allow or disallow data sharing for this company
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataTypes.length > 0 ? (
                    dataTypes.map(dataType => {
                      const effectivePref = getEffectivePreference(dataType);
                      const companyPref = preferences.find(p => p.dataType === dataType);
                      
                      return (
                        <div 
                          key={dataType} 
                          className="flex items-center justify-between p-4 border rounded-md"
                        >
                          <div>
                            <h3 className="font-medium">{dataType}</h3>
                            <div className="flex flex-col">
                              {effectivePref.isGlobal && !companyPref ? (
                                <p className="text-sm text-muted-foreground">
                                  Using global preference: {effectivePref.allowed ? 'Allowed' : 'Disallowed'}
                                </p>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  Company specific: {effectivePref.allowed ? 'Allowed' : 'Disallowed'}
                                </p>
                              )}
                              <p className="text-xs text-primary">
                                Cost: 1 token
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {effectivePref.isGlobal && !companyPref && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => createOrUpdatePreference(dataType, effectivePref.allowed)}
                              >
                                Override
                              </Button>
                            )}
                            <Switch
                              checked={effectivePref.allowed}
                              onCheckedChange={() => {
                                if (companyPref) {
                                  handleTogglePreference(companyPref);
                                } else {
                                  createOrUpdatePreference(dataType, !effectivePref.allowed);
                                }
                              }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No data types available for this company.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Clone Preferences</CardTitle>
                <CardDescription>
                  Copy preferences from another source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select
                    value={selectedCompanyId}
                    onValueChange={setSelectedCompanyId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global Preferences</SelectItem>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedCompanyId && (
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span className="text-sm">Clone cost:</span>
                      <div className={`flex items-center gap-1 ${hasEnoughTokensForClone ? 'text-green-600' : 'text-red-500'}`}>
                        <Coins className="h-4 w-4" />
                        <span className="font-medium">{cloneCost} Tokens</span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    onClick={handleClonePreferences}
                    disabled={!selectedCompanyId || !hasEnoughTokensForClone}
                  >
                    Apply Preferences
                  </Button>
                  
                  {selectedCompanyId && !hasEnoughTokensForClone && (
                    <Button asChild className="w-full">
                      <Link href="/tokens">
                        Buy Tokens
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>About Tokens</CardTitle>
                <CardDescription>How tokens work for preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>
                    <span className="font-medium">Company preferences:</span> 1 token per data type
                  </p>
                  <p>
                    <span className="font-medium">Cloning preferences:</span> 1 token per data type
                  </p>
                  <Button asChild size="sm" className="mt-2 w-full">
                    <Link href="/tokens">
                      <Coins className="mr-2 h-4 w-4" />
                      Buy More Tokens
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Preference Changes</DialogTitle>
              <DialogDescription>
                {pendingChanges.length > 0 ? (
                  `You are about to update ${changedPreferences} preference setting(s) for ${company.name}.`
                ) : (
                  `You are about to apply preferences from ${
                    selectedCompanyId === 'global' ? 'global settings' : 
                    companies.find(c => c.id === selectedCompanyId)?.name
                  } to ${company.name}.`
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Token Cost</h3>
                  <p className="text-sm text-muted-foreground">
                    This change will cost {pendingChanges.length > 0 ? tokenCost : cloneCost} token{(pendingChanges.length > 0 ? tokenCost : cloneCost) !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="font-bold">{pendingChanges.length > 0 ? tokenCost : cloneCost} / {user?.tokens || 0}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                These changes will apply immediately and may affect how your data is processed by {company.name}.
                Please review your changes carefully before proceeding.
              </p>
              
              {(pendingChanges.length > 0 && !hasEnoughTokens) || 
                (pendingChanges.length === 0 && !hasEnoughTokensForClone) ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  <p className="font-medium">Not enough tokens</p>
                  <p>Visit the Token Store to purchase more tokens.</p>
                </div>
              ) : null}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              {pendingChanges.length > 0 ? (
                <Button 
                  onClick={handleSubmitChanges}
                  disabled={!hasEnoughTokens}
                >
                  Confirm Changes
                </Button>
              ) : (
                <Button 
                  onClick={confirmClonePreferences}
                  disabled={!hasEnoughTokensForClone}
                >
                  Confirm Clone
                </Button>
              )}
              {((pendingChanges.length > 0 && !hasEnoughTokens) || 
                (pendingChanges.length === 0 && !hasEnoughTokensForClone)) && (
                <Button asChild>
                  <Link href="/tokens">
                    Buy Tokens
                  </Link>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
} 