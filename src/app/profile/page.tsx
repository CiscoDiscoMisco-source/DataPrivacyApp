'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, UserCircle, KeyRound, Trash, LogOut } from 'lucide-react';
import Link from 'next/link';
import { NavBar } from '@/components/nav-bar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load user data when component mounts
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setProfileData({
      username: user.username,
      email: user.email
    });
  }, [user, router]);

  const validateProfileForm = () => {
    let isValid = true;
    const newErrors = { ...errors, username: '' };

    if (!profileData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validatePasswordForm = () => {
    let isValid = true;
    const newErrors = { 
      ...errors, 
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would be an API call to update user profile
      // For demo purposes, we'll just simulate a successful update
      setTimeout(() => {
        // Update the user object in localStorage to reflect changes
        if (user) {
          const updatedUser = {
            ...user,
            username: profileData.username
          };
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully',
        });
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while updating your profile',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would be an API call to update password
      // For demo purposes, we'll just simulate a successful update
      setTimeout(() => {
        toast({
          title: 'Password updated',
          description: 'Your password has been updated successfully',
        });
        
        // Reset password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while updating your password',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    router.push('/login');
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <NavBar />
      <main className="container mx-auto p-4 max-w-5xl">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4 text-primary hover:text-primary/70 hover:bg-secondary">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="mb-4 bg-secondary/70 p-1">
                <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Account Info
                </TabsTrigger>
                <TabsTrigger value="password" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Password
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <Card className="border-none shadow-md">
                  <CardHeader className="border-b bg-secondary/30 pb-4">
                    <CardTitle className="text-primary text-xl">Account Information</CardTitle>
                    <CardDescription>
                      Update your account details
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={profileData.username}
                          onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                          className="rounded-lg"
                        />
                        {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={profileData.email}
                          disabled
                          className="bg-secondary/50 rounded-lg"
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6 bg-secondary/10">
                      <Button type="submit" disabled={isLoading} className="rounded-lg bg-primary hover:bg-primary/90">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="password">
                <Card className="border-none shadow-md">
                  <CardHeader className="border-b bg-secondary/30 pb-4">
                    <CardTitle className="text-primary text-xl">Change Password</CardTitle>
                    <CardDescription>
                      Update your password
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdatePassword}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="rounded-lg"
                        />
                        {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="rounded-lg"
                        />
                        {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="rounded-lg"
                        />
                        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6 bg-secondary/10">
                      <Button type="submit" disabled={isLoading} className="rounded-lg bg-primary hover:bg-primary/90">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-secondary/30 pb-4">
                <CardTitle className="text-primary text-xl">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="w-full rounded-lg border-primary/20 text-primary hover:bg-primary/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="w-full rounded-lg"
                  onClick={() => {
                    toast({
                      title: 'Account deletion',
                      description: 'This feature is not available in the demo',
                    });
                  }}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
            
            <Card className="mt-6 border-none shadow-md">
              <CardHeader className="border-b bg-secondary/30 pb-4">
                <CardTitle className="text-primary text-xl">Privacy Settings</CardTitle>
                <CardDescription>
                  Manage your data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Button asChild className="w-full rounded-lg bg-primary hover:bg-primary/90">
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