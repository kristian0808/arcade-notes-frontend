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
      // Call the context login function directly, which handles the API call
      await contextLogin(username, password);
      // No need to handle userData or token here
      navigate('/'); // Redirect to dashboard or home page on success
    } catch (err: any) { // Catch specific error type if possible
      // Error handling might be slightly different now, context might store the error
      console.error('Login failed in component:', err);
       // Check if the error response has a message, otherwise show generic error
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Centering the card on the page using Tailwind classes
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-[350px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Login</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Enter your credentials to access the arcade notes.</CardDescription>
        </CardHeader>
        {/* Use form inside CardContent for proper structure */}
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">Username</Label>
                <Input
                  id="username"
                  placeholder="Your username"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} // Add correct type
                  required
                  disabled={isLoading} // Disable input while loading
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} // Add correct type
                  required
                  disabled={isLoading} // Disable input while loading
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                />
              </div>
              {/* Display error message within the card content */}
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="pt-6">
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