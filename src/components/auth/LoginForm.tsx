
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBranches } from '@/lib/storage-service';
import { useLanguage } from '@/contexts/LanguageContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('admin');
  const navigate = useNavigate();
  const { toast } = useToast();
  const branches = getBranches();
  const { t, language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating authentication - In a real app, this would call an API
    setTimeout(() => {
      setIsLoading(false);
      
      // Simple validation for demo purposes
      if (email && password) {
        // Admin authentication
        if (email === 'admin@roadrunner.com' && password === 'admin123') {
          localStorage.setItem('user', JSON.stringify({ 
            role: 'admin', 
            email,
            branchAccess: 'all' // Admin has access to all branches
          }));
          toast({
            title: t('login'),
            description: "Welcome to Road Runner Rentals admin portal",
          });
          navigate('/dashboard');
          return;
        }
        
        // Branch manager authentication
        const branchCredentials = {
          'branch1': { email: 'branch1@roadrunner.com', password: 'branch1' },
          'branch2': { email: 'branch2@roadrunner.com', password: 'branch2' },
          'branch3': { email: 'branch3@roadrunner.com', password: 'branch3' },
        };
        
        // Check if credentials match any branch
        for (const [branchId, credentials] of Object.entries(branchCredentials)) {
          if (email === credentials.email && password === credentials.password) {
            // If branch selection doesn't match credentials, use the correct branch
            const correctBranchId = branchId;
            const branch = branches.find(b => b.id === correctBranchId);
            
            localStorage.setItem('user', JSON.stringify({ 
              role: 'branch-manager', 
              email,
              branchAccess: correctBranchId,
              branchName: branch ? branch.name : correctBranchId
            }));
            
            // Set current branch for the branch manager
            localStorage.setItem('currentBranch', correctBranchId);
            
            toast({
              title: t('login'),
              description: `Welcome to ${branch ? branch.name : correctBranchId} management portal`,
            });
            navigate('/dashboard');
            return;
          }
        }
        
        toast({
          title: t('login'),
          description: t('invalidCredentials'),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('login'),
          description: t('enterBothFields'),
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Road Runner Rentals</CardTitle>
        <CardDescription className="text-center">{t('signIn')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="space-y-2">
            <label htmlFor="email" className="form-label">{t('email')}</label>
            <Input
              id="email"
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="form-label">{t('password')}</label>
            <Input
              id="password"
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-rental-600 hover:bg-rental-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? t('loggingIn') : t('login')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-gray-500">
          <p>{t('demoCredentials')}</p>
          <p>Admin: admin@roadrunner.com / admin123</p>
          <p>Branch 1: branch1@roadrunner.com / branch1</p>
          <p>Branch 2: branch2@roadrunner.com / branch2</p>
          <p>Branch 3: branch3@roadrunner.com / branch3</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
