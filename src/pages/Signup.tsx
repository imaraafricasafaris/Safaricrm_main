import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Map, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { passwordRequirements, validatePassword } from '../utils/passwordValidation';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowRequirements(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('Password does not meet all requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password);
      navigate('/login');
    } catch (err) {
      setError('Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Map className="w-12 h-12 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start managing your safari business
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 text-red-500 dark:text-red-200 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setShowRequirements(true)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {showRequirements && (
                <div className="mt-2 space-y-2">
                  {passwordRequirements.map((req) => (
                    <div
                      key={req.id}
                      className={`flex items-center text-sm ${
                        req.validator(password)
                          ? 'text-green-500 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {req.validator(password) ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <X className="w-4 h-4 mr-2" />
                      )}
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error === 'Passwords do not match') {
                    setError('');
                  }
                }}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {confirmPassword && (
                <div className="mt-2 flex items-center text-sm">
                  {password === confirmPassword ? (
                    <div className="text-green-500 dark:text-green-400 flex items-center">
                      <Check className="w-4 h-4 mr-2" />
                      Passwords match
                    </div>
                  ) : (
                    <div className="text-red-500 dark:text-red-400 flex items-center">
                      <X className="w-4 h-4 mr-2" />
                      Passwords do not match
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-primary hover:text-primary/90">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}