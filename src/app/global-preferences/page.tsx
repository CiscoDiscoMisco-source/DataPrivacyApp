'use client';

import { useState, useEffect } from 'react';
import { Preference } from '@/models/preference';
import { Company } from '@/models/company';
import dataService from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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

export default function GlobalPreferences() {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Preference[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load global preferences and companies
    const loadData = () => {
      const prefs = dataService.getGlobalPreferences();
      const allCompanies = dataService.getCompanies();
      setPreferences(prefs);
      setPendingChanges([]);
      setCompanies(allCompanies);
      setLoading(false);
      setHasChanges(false);
    };

    loadData();
    
    // Subscribe to preference changes
    const unsubscribe = dataService.subscribeToPreferenceChanges(() => {
      // Reload preferences when they change
      const updatedPrefs = dataService.getGlobalPreferences();
      setPreferences(updatedPrefs);
      setPendingChanges([]);
      setHasChanges(false);
    });
    
    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, []);

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
      description: `${pendingChanges.length} global preference(s) have been updated.`,
    });
    
    // Reset pending changes
    setPendingChanges([]);
    setHasChanges(false);
    setShowConfirmDialog(false);
  };
  
  const handleDiscardChanges = () => {
    // Reload preferences to discard changes
    const originalPrefs = dataService.getGlobalPreferences();
    setPreferences(originalPrefs);
    setPendingChanges([]);
    setHasChanges(false);
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
                      <p className="text-sm text-muted-foreground">
                        {preference.allowed 
                          ? 'Currently allowed for all companies' 
                          : 'Currently disallowed for all companies'}
                      </p>
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
        
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Preference Changes</DialogTitle>
              <DialogDescription>
                You are about to update {changedPreferences} global preference setting{changedPreferences !== 1 ? 's' : ''}.
                This will affect how your data is shared with all companies.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                These changes will apply immediately and may affect how your data is processed.
                Please review your changes carefully before proceeding.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitChanges}>
                Confirm Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
} 