'use client';

import { useState, useEffect } from 'react';
import { Preference } from '@/models/preference';
import { Company } from '@/models/company';
import { User } from '@/models/user';
import dataService from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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

export default function GlobalPreferences() {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Preference[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [tokenCost, setTokenCost] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load global preferences and companies
    const loadData = () => {
      const prefs = dataService.getGlobalPreferences();
      const allCompanies = dataService.getCompanies();
      const userData = dataService.getUser();
      setPreferences(prefs);
      setCompanies(allCompanies);
      setUser(userData);
      setPendingChanges([]);
      setLoading(false);
      setHasChanges(false);
      setTokenCost(0);
    };

    loadData();
    
    // Subscribe to preference changes
    const unsubscribe = dataService.subscribeToPreferenceChanges(() => {
      // Reload preferences when they change
      const updatedPrefs = dataService.getGlobalPreferences();
      setPreferences(updatedPrefs);
      setPendingChanges([]);
      setHasChanges(false);
      setTokenCost(0);
    });
    
    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, []);

  // Recalculate token cost whenever pending changes are updated
  useEffect(() => {
    if (pendingChanges.length > 0) {
      const cost = dataService.calculatePreferenceCost(pendingChanges);
      setTokenCost(cost);
    } else {
      setTokenCost(0);
    }
  }, [pendingChanges]);

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
        description: `${pendingChanges.length} global preference(s) have been updated. ${tokenCost} tokens spent.`,
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
    const originalPrefs = dataService.getGlobalPreferences();
    setPreferences(originalPrefs);
    setPendingChanges([]);
    setHasChanges(false);
    setTokenCost(0);
  };

  // Get data types used by at least one company
  const getUsedDataTypes = (): string[] => {
    if (!companies.length) return [];
    
    // Extract all data types from all companies
    const dataTypes = new Set<string>();
    companies.forEach(company => {
      company.dataSharingPolicies.forEach(policy => {
        dataTypes.add(policy.dataType);
      });
    });
    
    return Array.from(dataTypes);
  };

  // Filter preferences to only show ones for data types that are actually used
  const getRelevantPreferences = (): Preference[] => {
    const usedDataTypes = getUsedDataTypes();
    return preferences.filter(pref => usedDataTypes.includes(pref.dataType));
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

  const relevantPreferences = getRelevantPreferences();
  const changedPreferences = pendingChanges.length;
  const hasEnoughTokens = user ? user.tokens >= tokenCost : false;

  return (
    <>
      <NavBar />
      <main className="container mx-auto p-4">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Global Data Preferences</h1>
          <p className="text-muted-foreground mt-2">
            These preferences apply to all companies unless overridden by company-specific settings.
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

        <Card>
          <CardHeader>
            <CardTitle>Manage Global Preferences</CardTitle>
            <CardDescription>
              Toggle preferences to allow or disallow data sharing across all companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relevantPreferences.length > 0 ? (
                relevantPreferences.map(preference => (
                  <div 
                    key={preference.id} 
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div>
                      <h3 className="font-medium">{preference.dataType}</h3>
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">
                          {preference.allowed 
                            ? 'Currently allowed for all companies' 
                            : 'Currently disallowed for all companies'}
                        </p>
                        <p className="text-xs text-primary">
                          Cost: {companies.length} token{companies.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={preference.allowed}
                      onCheckedChange={() => handleTogglePreference(preference)}
                    />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No data types are currently used by any companies.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Preference Changes</DialogTitle>
              <DialogDescription>
                You are about to update {changedPreferences} global preference setting{changedPreferences !== 1 ? 's' : ''}.
                This will affect how your data is shared with all companies.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Token Cost</h3>
                  <p className="text-sm text-muted-foreground">
                    This change will cost {tokenCost} token{tokenCost !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="font-bold">{tokenCost} / {user?.tokens || 0}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                These changes will apply immediately and may affect how your data is processed.
                Please review your changes carefully before proceeding.
              </p>
              
              {!hasEnoughTokens && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  <p className="font-medium">Not enough tokens</p>
                  <p>Visit the Token Store to purchase more tokens.</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitChanges}
                disabled={!hasEnoughTokens}
              >
                Confirm Changes
              </Button>
              {!hasEnoughTokens && (
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