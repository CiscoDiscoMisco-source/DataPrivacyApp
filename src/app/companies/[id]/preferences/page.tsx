'use client';

import { useState, useEffect } from 'react';
import { Company } from '@/models/company';
import { Preference } from '@/models/preference';
import dataService from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const loadData = () => {
    const companyData = dataService.getCompany(params.id);
    const companiesData = dataService.getCompanies().filter(c => c.id !== params.id);
    const preferencesData = dataService.getCompanyPreferences(params.id);
    const globalPrefs = dataService.getGlobalPreferences();
    
    if (companyData) {
      setCompany(companyData);
      setCompanies(companiesData);
      setPreferences(preferencesData);
      setGlobalPreferences(globalPrefs);
    }
    
    setPendingChanges([]);
    setHasChanges(false);
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
      setPreferences(updatedPreferences);
      setGlobalPreferences(updatedGlobalPrefs);
      setPendingChanges([]);
      setHasChanges(false);
    });
    
    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, [params.id]);

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
    // Save all pending changes
    pendingChanges.forEach(preference => {
      dataService.savePreference(preference);
    });
    
    // Show toast notification
    toast({
      title: 'Preferences Updated',
      description: `${pendingChanges.length} preference(s) have been updated for ${company?.name}.`,
    });
    
    // Reset pending changes
    setPendingChanges([]);
    setHasChanges(false);
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
        description: `Global preferences have been applied to ${company?.name}.`,
      });
    } else {
      // Clone preferences from another company
      dataService.clonePreferences(selectedCompanyId, params.id);
      
      // Show toast notification
      const sourceCompany = companies.find(c => c.id === selectedCompanyId);
      toast({
        title: 'Preferences Cloned',
        description: `Preferences from ${sourceCompany?.name} have been applied to ${company?.name}.`,
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
                            {effectivePref.isGlobal && !companyPref ? (
                              <p className="text-sm text-muted-foreground">
                                Using global preference: {effectivePref.allowed ? 'Allowed' : 'Disallowed'}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Company specific: {effectivePref.allowed ? 'Allowed' : 'Disallowed'}
                              </p>
                            )}
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
                  
                  {hasChanges && (
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={handleDiscardChanges}
                      >
                        Discard Changes
                      </Button>
                      <Button 
                        onClick={() => setShowConfirmDialog(true)}
                      >
                        Save Changes
                      </Button>
                    </div>
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
                  
                  <Button 
                    className="w-full" 
                    onClick={handleClonePreferences}
                    disabled={!selectedCompanyId}
                  >
                    Apply Preferences
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
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                These changes will apply immediately and may affect how your data is processed by {company.name}.
                Please review your changes carefully before proceeding.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={pendingChanges.length > 0 ? handleSubmitChanges : confirmClonePreferences}>
                Confirm Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
} 