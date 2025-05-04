import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for redirection
import { Button } from "@/components/ui/button"; // Import Shadcn Button
import { Input } from "@/components/ui/input";   // Import Shadcn Input
import { Label } from "@/components/ui/label";   // Import Shadcn Label
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Import Shadcn Card components

import { login } from '../api/authApi'; // Import the actual login API function
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login: contextLogin } = useAuth(); // Get login function from context
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Call the actual login API
      const userData = await login(username, password);
      contextLogin(userData.access_token); // Store token via context
      navigate('/'); // Redirect to dashboard or home page on success
    } catch (err: any) { // Catch specific error type if possible
      console.error('Login failed:', err);
       // Check if the error response has a message, otherwise show generic error
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Centering the card on the page using Tailwind classes
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access the arcade notes.</CardDescription>
        </CardHeader>
        {/* Use form inside CardContent for proper structure */}
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Your username"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} // Add correct type
                  required
                  disabled={isLoading} // Disable input while loading
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} // Add correct type
                  required
                  disabled={isLoading} // Disable input while loading
                />
              </div>
              {/* Display error message within the card content */}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            {/* Button triggers form submission */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;