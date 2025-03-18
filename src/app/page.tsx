'use client';

import { useEffect, useState } from 'react';
import { Company } from '@/models/company';
import CompanyList from '@/components/company-list';
import { Input } from '@/components/ui/input';
import dataService from '@/services/dataService';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { NavBar } from '@/components/nav-bar';

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [forceRender, setForceRender] = useState(0);

  useEffect(() => {
    const fetchCompanies = () => {
      const allCompanies = dataService.getCompanies();
      setCompanies(allCompanies);
      setFilteredCompanies(allCompanies);
    };

    fetchCompanies();
    
    // Subscribe to preference changes to update badge statuses
    const unsubscribe = dataService.subscribeToPreferenceChanges(() => {
      // Force a re-render to update preference status badges
      setForceRender(prev => prev + 1);
    });
    
    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchQuery, companies]);

  return (
    <>
      <NavBar />
      <main className="container mx-auto p-4">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
            <p className="text-muted-foreground mt-1">
              Manage your data sharing preferences with these companies
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link href="/global-preferences">
                Global Preferences
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search companies by name or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <CompanyList companies={filteredCompanies} />
      </main>
    </>
  );
} 