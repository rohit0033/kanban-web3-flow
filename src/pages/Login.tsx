import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    acceptTerms: false,
    rememberMe: false
  });
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isSignup) {
        if (!formData.acceptTerms) {
          setError("Please accept the terms & conditions");
          setIsLoading(false);
          return;
        }
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        });
      }
      navigate('/board');
    } catch (err) {
      setError(isSignup ? 'Failed to create account' : 'Failed to login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-4 sm:p-6">
      <div className="w-full max-w-xl rounded-xl  overflow-hidden">
        <div className="p-8 md:p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            {isSignup ? 'Sign up' : 'Log in!'}
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {isSignup && (
              <div className="text-left">
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="h-12 bg-transparent border border-white/30 text-white placeholder-white/70 focus:border-white text-lg px-4"
                  required
                />
              </div>
            )}

            <div className="text-left">
              <Label htmlFor="email" className="text-white text-sm font-medium block mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="abcd@gmail.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="h-12 bg-transparent border border-white/30 text-white placeholder-white/70 focus:border-white text-lg px-4"
                required
              />
            </div>

            <div className="text-left">
              <Label htmlFor="password" className="text-white text-sm font-medium block mb-2">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="h-12 bg-transparent border border-white/30 text-white placeholder-white/70 focus:border-white text-lg px-4"
                required
              />
            </div>

            {isSignup ? (
              <div className="flex items-center space-x-3 text-left">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleChange('acceptTerms', !!checked)}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-900 h-5 w-5"
                />
                <Label htmlFor="terms" className="text-white text-base">
                  I accept the terms & conditions
                </Label>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleChange('rememberMe', !!checked)}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-900 h-5 w-5"
                  />
                  <Label htmlFor="remember" className="text-white text-base">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-white text-base hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-white hover:bg-gray-100 text-blue-900 hover:text-blue-800 font-semibold py-6 text-lg rounded-lg mt-6"
              disabled={isLoading}
            >
              {isLoading 
                ? (isSignup ? 'Creating account...' : 'Logging in...')
                : (isSignup ? 'Sign up' : 'Log in')
              }
            </Button>
          </form>

          <div className="mt-8">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-white text-lg hover:underline"
              type="button"
            >
              {isSignup 
                ? 'Already have an account? Log in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;