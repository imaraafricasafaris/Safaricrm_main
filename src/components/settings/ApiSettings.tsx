import React, { useState } from 'react';
import { Terminal, Key, Shield, Globe, AlertTriangle, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface ApiKeyEntry {
  id: string;
  name: string;
  key: string;
  provider: string;
  status: 'active' | 'inactive' | 'error';
  lastValidated?: string;
}

export default function ApiSettings() {
  const [defaultRateLimit, setDefaultRateLimit] = useState(1000);
  const [apiVersion, setApiVersion] = useState('v1');
  const [isValidating, setIsValidating] = useState(false);
  const [showAddKey, setShowAddKey] = useState(false);
  const [newKey, setNewKey] = useState({
    name: '',
    key: '',
    provider: 'safaribookings'
  });

  const apiKeys: ApiKeyEntry[] = [
    {
      id: '1',
      name: 'SafariBookings API',
      key: '••••••••••••••••',
      provider: 'safaribookings',
      status: 'active',
      lastValidated: '2024-03-19T10:00:00Z'
    },
    {
      id: '2',
      name: 'Facebook API',
      key: '••••••••••••••••',
      provider: 'facebook',
      status: 'active',
      lastValidated: '2024-03-19T10:00:00Z'
    }
  ];

  const validateApiKey = async (key: ApiKeyEntry) => {
    setIsValidating(true);
    try {
      // TODO: Implement actual API validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('API key validated successfully');
    } catch (error) {
      toast.error('Failed to validate API key');
    } finally {
      setIsValidating(false);
    }
  };

  const handleAddKey = async () => {
    try {
      // TODO: Implement API key addition
      toast.success('API key added successfully');
      setShowAddKey(false);
      setNewKey({ name: '', key: '', provider: 'safaribookings' });
    } catch (error) {
      toast.error('Failed to add API key');
    }
  };

  const handleSaveChanges = () => {
    toast.success('API settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            API Settings
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Third Party API Keys */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Third Party API Keys
              </h3>
            </div>
            <button
              onClick={() => setShowAddKey(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add API Key
            </button>
          </div>

          {showAddKey && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Provider
                  </label>
                  <select
                    value={newKey.provider}
                    onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="safaribookings">SafariBookings</option>
                    <option value="facebook">Facebook</option>
                    <option value="google">Google Maps</option>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                    <option value="make">Make.com</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newKey.name}
                    onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Enter key name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={newKey.key}
                    onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Enter API key"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowAddKey(false)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddKey}
                  className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Key
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {key.name}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      key.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : key.status === 'error'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {key.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => validateApiKey(key)}
                      disabled={isValidating}
                      className="text-sm text-primary hover:text-primary/90 disabled:opacity-50"
                    >
                      Validate
                    </button>
                    <button className="text-sm text-primary hover:text-primary/90">
                      Edit
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                    {key.key}
                  </code>
                  {key.lastValidated && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last validated: {new Date(key.lastValidated).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Security
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                API Key Expiration
              </label>
              <select className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary">
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                IP Whitelist
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Enter IP addresses (one per line)"
              />
            </div>
          </div>
        </div>

        {/* Rate Limiting */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Rate Limiting
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Default Rate Limit
              </label>
              <input
                type="number"
                min="0"
                value={defaultRateLimit}
                onChange={(e) => setDefaultRateLimit(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Requests per minute
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                API Version
              </label>
              <select
                value={apiVersion}
                onChange={(e) => setApiVersion(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="v1">Version 1 (Latest)</option>
                <option value="v2">Version 2 (Beta)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Usage Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Usage Alerts
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Rate Limit Alerts
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get notified when rate limits are exceeded
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Error Notifications
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get notified about API errors
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Changes */}
      <div className="flex justify-end">
        <button 
          onClick={handleSaveChanges}
          className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}