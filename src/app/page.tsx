'use client';

import { useEffect, useState } from 'react';
import { Company } from '@/models/company';
import CompanyList from '@/components/company-list';
import { Input } from '@/components/ui/input';
import dataService from '@/services/dataService';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { NavBar } from '@/components/nav-bar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [forceRender, setForceRender] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchCompanies = () => {
      const allCompanies = dataService.getCompanies();
      setCompanies(allCompanies);
      setFilteredCompanies(allCompanies);
      
      // Extract unique categories/industries
      const uniqueCategories = Array.from(
        new Set(allCompanies.map(company => company.industry))
      );
      setCategories(uniqueCategories);
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
    // Filter by search query only
    if (searchQuery) {
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
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

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-secondary/70 p-1 flex flex-wrap h-auto">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              All Categories
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            <CompanyList companies={filteredCompanies} />
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <CompanyList 
                companies={filteredCompanies.filter(company => company.industry === category)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </>
  );
} 