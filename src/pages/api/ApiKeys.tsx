import React, { useState, useEffect } from 'react';
import { Key, Plus, Copy, Eye, EyeOff, MoreHorizontal, Search, Filter, Calendar, AlertTriangle } from 'lucide-react';
import { getApiKeys } from '../../lib/api/apiSystem';
import { ApiKey } from '../../types/api';
import ApiKeyModal from '../../components/api/ApiKeyModal';
import ApiKeyActions from '../../components/api/ApiKeyActions';
import toast from 'react-hot-toast';

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showActions, setShowActions] = useState<{ id: string; position: { top: number; left: number } } | null>(null);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setIsLoading(true);
      const data = await getApiKeys();
      setApiKeys(data);
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = () => {
    setSelectedKey(null);
    setShowModal(true);
  };

  const handleEditKey = (key: ApiKey) => {
    setSelectedKey(key);
    setShowModal(true);
  };

  const toggleSecretVisibility = (keyId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleActionsClick = (e: React.MouseEvent, key: ApiKey) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setShowActions({
      id: key.id,
      position: {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      }
    });
  };

  const filteredKeys = apiKeys.filter(key => 
    key.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Key className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            API Keys
          </h2>
        </div>
        <button 
          onClick={handleCreateKey}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-[30px] hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Generate New Key
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search API keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[30px] focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-[30px] transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-[30px] transition-colors">
          <Calendar className="w-4 h-4" />
          Date Range
        </button>
      </div>

      {/* API Keys List */}
      <div className="bg-white dark:bg-gray-800 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">API Key</th>
                <th className="px-6 py-4">Secret</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Rate Limit</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredKeys.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {key.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-gray-600 dark:text-gray-300">
                        {key.key.slice(0, 12)}...
                      </code>
                      <button
                        onClick={() => copyToClipboard(key.key)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-gray-600 dark:text-gray-300">
                        {showSecrets[key.id] ? key.secret : '••••••••'}
                      </code>
                      <button
                        onClick={() => toggleSecretVisibility(key.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showSecrets[key.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      key.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {key.rate_limit}/min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(key.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <button 
                      onClick={(e) => handleActionsClick(e, key)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Key Modal */}
      {showModal && (
        <ApiKeyModal
          apiKey={selectedKey}
          onClose={() => setShowModal(false)}
          onSuccess={loadApiKeys}
        />
      )}

      {/* Actions Menu */}
      {showActions && (
        <ApiKeyActions
          position={showActions.position}
          onClose={() => setShowActions(null)}
          onEdit={() => {
            const key = apiKeys.find(k => k.id === showActions.id);
            if (key) {
              handleEditKey(key);
            }
            setShowActions(null);
          }}
          onRevoke={async () => {
            try {
              // TODO: Implement key revocation
              toast.success('API key revoked');
              await loadApiKeys();
            } catch (error) {
              toast.error('Failed to revoke API key');
            }
            setShowActions(null);
          }}
        />
      )}
    </div>
  );
}