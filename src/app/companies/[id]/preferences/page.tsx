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

export default function CompanyPreferences({ params }: { params: { id: string } }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [globalPreferences, setGlobalPreferences] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
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
    });
    
    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, [params.id]);

  const handleTogglePreference = (preference: Preference) => {
    const updatedPreference = {
      ...preference,
      allowed: !preference.allowed
    };

    // Save the updated preference
    dataService.savePreference(updatedPreference);

    // Show toast notification
    toast({
      title: `${updatedPreference.allowed ? 'Allowed' : 'Disallowed'} ${updatedPreference.dataType}`,
      description: `Preference for ${updatedPreference.dataType} has been updated for ${company?.name}.`,
    });
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
    
    // Save the new preference
    dataService.savePreference(newPreference);
    
    // Show toast notification
    toast({
      title: `${allowed ? 'Allowed' : 'Disallowed'} ${dataType}`,
      description: `New preference for ${dataType} has been set for ${company?.name}.`,
    });
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
  };

  const getDataTypes = (): string[] => {
    if (!company) return [];
    
    // Get unique data types from company policies
    const dataTypesFromPolicies = company.dataSharingPolicies.map(
      policy => policy.dataType
    );
    
    // Get data types from global preferences
    const dataTypesFromGlobal = globalPreferences.map(pref => pref.dataType);
    
    // Combine and make unique
    return Array.from(new Set([...dataTypesFromPolicies, ...dataTypesFromGlobal]));
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
                  {getDataTypes().map(dataType => {
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
                              Override Global
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
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Clone Preferences</CardTitle>
                <CardDescription>
                  Copy preferences from another company or from global settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Source</label>
                    <Select
                      value={selectedCompanyId}
                      onValueChange={setSelectedCompanyId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a source" />
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
                  </div>
                  <Button 
                    onClick={handleClonePreferences}
                    disabled={!selectedCompanyId}
                    className="w-full"
                  >
                    Clone Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Manage Global Preferences</CardTitle>
                <CardDescription>
                  Edit preferences for all companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/global-preferences">
                    Global Preferences
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
} 