'use client';

import { useState, useEffect } from 'react';
import { User, TokenPackage } from '@/models/user';
import dataService from '@/services/dataService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dialog';

export default function TokenStore() {
  const [user, setUser] = useState<User | null>(null);
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load user data and token packages
    const loadData = () => {
      const userData = dataService.getUser();
      const tokenPackages = dataService.getTokenPackages();
      setUser(userData);
      setPackages(tokenPackages);
      setLoading(false);
    };

    loadData();
  }, []);

  const handlePurchase = (tokenPackage: TokenPackage) => {
    setSelectedPackage(tokenPackage);
    setShowConfirmDialog(true);
  };
  
  const confirmPurchase = () => {
    if (!selectedPackage) return;
    
    const success = dataService.purchaseTokens(selectedPackage.id);
    
    if (success) {
      // Update user data
      const updatedUser = dataService.getUser();
      setUser(updatedUser);
      
      // Show toast notification
      toast({
        title: 'Purchase Successful',
        description: `You have purchased ${selectedPackage.amount} tokens.`,
      });
    } else {
      toast({
        title: 'Purchase Failed',
        description: 'There was an error processing your purchase.',
        variant: 'destructive'
      });
    }
    
    setShowConfirmDialog(false);
    setSelectedPackage(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl">Loading token store...</p>
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
          <h1 className="text-3xl font-bold">Token Store</h1>
          <p className="text-muted-foreground mt-2">
            Purchase tokens to manage your data preferences
          </p>
        </div>

        <div className="mb-8 p-6 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-medium">Your Balance</h2>
              <p className="text-muted-foreground">Available tokens for preference changes</p>
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Coins className="h-6 w-6 text-primary" />
              <span>{user?.tokens || 0} Tokens</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Token Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <Card key={pkg.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold mb-2">
                  <Coins className="h-8 w-8 text-primary" />
                  <span>{pkg.amount} Tokens</span>
                </div>
                <div className="text-center text-2xl font-semibold text-muted-foreground">
                  ${pkg.price.toFixed(2)}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handlePurchase(pkg)}
                >
                  Purchase
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>About Tokens</CardTitle>
              <CardDescription>How the token system works</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Company Preferences</h3>
                  <p className="text-muted-foreground">
                    Modifying preferences for a specific company costs 1 token per data type.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Global Preferences</h3>
                  <p className="text-muted-foreground">
                    Modifying global preferences costs 1 token per data type, multiplied by the number of companies affected.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Token Usage</h3>
                  <p className="text-muted-foreground">
                    Tokens are deducted when you save your preference changes. You can make multiple toggles before saving to optimize token usage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                {selectedPackage && `You are about to purchase ${selectedPackage.amount} tokens for $${selectedPackage.price.toFixed(2)}.`}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                In a real application, this would connect to a payment processor. For this demo, tokens will be added immediately without actual payment.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmPurchase}>
                Confirm Purchase
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
} 