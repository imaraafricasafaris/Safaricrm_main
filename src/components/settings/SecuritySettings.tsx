import React, { useState } from 'react';
import { Shield, Key, Lock, Smartphone, AlertTriangle } from 'lucide-react';

export default function SecuritySettings() {
  const [passwordLength, setPasswordLength] = useState(8);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Security Settings
        </h2>

        <div className="space-y-8">
          {/* Password Requirements */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Password Requirements
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Minimum Password Length: {passwordLength} characters
                </label>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>8</span>
                  <span>32</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Special Characters', icon: '!@#' },
                  { label: 'Numbers', icon: '123' },
                  { label: 'Uppercase Letters', icon: 'ABC' },
                  { label: 'Lowercase Letters', icon: 'abc' }
                ].map((req) => (
                  <div
                    key={req.label}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-primary-500/20 hover:border-primary-500 transition-colors cursor-pointer"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-300">{req.label}</span>
                    <span className="text-xs font-mono bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2 py-1 rounded">
                      {req.icon}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <div className="relative">
                <input type="checkbox" id="2fa-toggle" className="sr-only" />
                <label
                  htmlFor="2fa-toggle"
                  className="flex items-center h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 peer-checked:bg-primary-500"
                >
                  <span className="absolute left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5" />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { method: 'Authenticator App', icon: Smartphone },
                { method: 'SMS Verification', icon: Key },
                { method: 'Security Key', icon: Lock }
              ].map((method) => (
                <button
                  key={method.method}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
                >
                  <method.icon className="w-6 h-6 text-primary-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{method.method}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Session Management */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Session Management
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Session Timeout: {sessionTimeout} minutes
                </label>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 min</span>
                  <span>2 hours</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-primary-500">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Auto-logout on browser close is enabled
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-7">
                  For enhanced security, you will be logged out when closing your browser
                </p>
              </div>
            </div>
          </div>

          {/* Login Activity */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Recent Login Activity
            </h3>
            <div className="space-y-3">
              {[
                { device: 'Chrome on MacOS', time: '2 minutes ago', location: 'Nairobi, Kenya', status: 'success' },
                { device: 'Safari on iPhone', time: '1 day ago', location: 'Mombasa, Kenya', status: 'success' },
                { device: 'Firefox on Windows', time: '3 days ago', location: 'Dar es Salaam, Tanzania', status: 'warning' }
              ].map((login, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-transparent hover:border-primary-500 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      login.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {login.device}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {login.location} • {login.time}
                      </p>
                    </div>
                  </div>
                  <button className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Changes */}
          <div className="flex justify-end pt-4">
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}