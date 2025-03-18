'use client';

import { useState, useEffect } from 'react';
import { Company, DataSharingPolicy } from '@/models/company';
import dataService from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Preference } from '@/models/preference';
import { Badge } from '@/components/ui/badge';
import { NavBar } from '@/components/nav-bar';

export default function CompanyDetail({ params }: { params: { id: string } }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [forceRender, setForceRender] = useState(0);

  useEffect(() => {
    // Load company and preferences
    const loadData = () => {
      const companyData = dataService.getCompany(params.id);
      const preferencesData = dataService.getCompanyPreferences(params.id);
      
      if (companyData) {
        setCompany(companyData);
        setPreferences(preferencesData);
      }
      
      setLoading(false);
    };

    loadData();
    
    // Subscribe to preference changes
    const unsubscribe = dataService.subscribeToPreferenceChanges(() => {
      // Force a re-render to update badge statuses
      setForceRender(prev => prev + 1);
    });
    
    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, [params.id]);

  const getPreferenceStatus = (dataType: string): boolean => {
    return dataService.getEffectivePreference(dataType, params.id);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl">Loading company data...</p>
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
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <p className="text-muted-foreground">{company.industry}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/companies/${company.id}/preferences`}>
                  Manage Preferences
                </Link>
              </Button>
            </div>
          </div>
          
          <p className="mt-4">{company.description}</p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Data Sharing Policies</h2>
          <div className="grid grid-cols-1 gap-4">
            {company.dataSharingPolicies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{policy.dataType}</CardTitle>
                      <CardDescription className="mt-1">
                        Purpose: {policy.purpose}
                      </CardDescription>
                    </div>
                    <Badge variant={getPreferenceStatus(policy.dataType) ? "default" : "destructive"}>
                      {getPreferenceStatus(policy.dataType) ? "Allowed" : "Disallowed"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{policy.description}</p>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Shared with third parties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {policy.thirdParties.map((party, index) => (
                        <Badge key={index} variant="outline">
                          {party}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
} 