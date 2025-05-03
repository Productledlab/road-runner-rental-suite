
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating authentication - In a real app, this would call an API
    setTimeout(() => {
      setIsLoading(false);
      
      // Simple validation for demo purposes
      if (email && password) {
        // Mock authentication logic - only admin is supported now
        if (email === 'admin@roadrunner.com' && password === 'admin123') {
          localStorage.setItem('user', JSON.stringify({ role: 'admin', email }));
          toast({
            title: "Login successful",
            description: "Welcome to Road Runner Rentals admin portal",
          });
          navigate('/dashboard');
        } else {
          toast({
            title: "Login failed",
            description: "Invalid credentials. Use admin@roadrunner.com/admin123",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Login failed",
          description: "Please enter both email and password",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Road Runner Rentals</CardTitle>
        <CardDescription className="text-center">Sign in to access the admin portal</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="form-label">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="form-label">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
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
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-gray-500">
          <p>Demo credentials:</p>
          <p>Admin: admin@roadrunner.com / admin123</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
