import React, { useState, useRef, useEffect } from 'react';
import {
  Settings2, Shield, Globe, Bell, Database, Palette, Building2, Users, 
  CreditCard, Mail, Zap, HelpCircle, Terminal, MoreHorizontal, ChevronDown 
} from 'lucide-react';
import CompanySettings from './CompanySettings';
import SecuritySettings from './SecuritySettings';
import GeneralSettings from './GeneralSettings';
import NotificationSettings from './NotificationSettings';
import DataManagementSettings from './DataManagementSettings';
import BrandSettings from './BrandSettings';
import ApiSettings from './ApiSettings';
import IntegrationSettings from './IntegrationSettings';
import EmailTemplateSettings from './EmailTemplateSettings';
import WorkflowAutomationSettings from './WorkflowAutomationSettings';
import HelpSupportSettings from './HelpSupportSettings';

const tabs = [
  { id: 'general', label: 'General', icon: Settings2, component: GeneralSettings, priority: 'high' },
  { id: 'company', label: 'Company', icon: Building2, component: CompanySettings, priority: 'high' },
  { id: 'security', label: 'Security', icon: Shield, component: SecuritySettings, priority: 'high' },
  { id: 'notifications', label: 'Notifications', icon: Bell, component: NotificationSettings, priority: 'high' },
  { id: 'brand', label: 'Brand', icon: Palette, component: BrandSettings, priority: 'medium' },
  { id: 'integrations', label: 'Integrations', icon: Globe, component: IntegrationSettings, priority: 'medium' },
  { id: 'api', label: 'API Settings', icon: Terminal, component: ApiSettings, priority: 'medium' },
  { id: 'data', label: 'Data', icon: Database, component: DataManagementSettings, priority: 'medium' },
  { id: 'email', label: 'Email Templates', icon: Mail, component: EmailTemplateSettings, priority: 'medium' },
  { id: 'automation', label: 'Automation', icon: Zap, component: WorkflowAutomationSettings, priority: 'low' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, component: HelpSupportSettings, priority: 'low' }
];

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Determine how many tabs to show based on screen size
  const [visibleTabs, setVisibleTabs] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) { // xl
        setVisibleTabs(7);
      } else if (window.innerWidth >= 1024) { // lg
        setVisibleTabs(5);
      } else if (window.innerWidth >= 768) { // md
        setVisibleTabs(4);
      } else {
        setVisibleTabs(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainTabs = tabs.slice(0, visibleTabs);
  const dropdownTabs = tabs.slice(visibleTabs);

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || GeneralSettings;

  return (
    <div className="space-y-6">
      {/* Quick Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search settings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex items-center gap-2" aria-label="Settings">
          {/* Main Tabs */}
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-3 px-3 text-sm font-medium rounded-t-lg border-b-2 whitespace-nowrap
                  ${isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <Icon className={`
                  w-4 h-4 mr-2
                  ${isActive
                    ? 'text-primary'
                    : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  }
                `} />
                {tab.label}
              </button>
            );
          })}

          {/* More Dropdown */}
          {dropdownTabs.length > 0 && (
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`
                  group inline-flex items-center py-3 px-3 text-sm font-medium rounded-t-lg border-b-2 whitespace-nowrap
                  ${showMoreMenu
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <MoreHorizontal className="w-4 h-4 mr-1" />
                More
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showMoreMenu && (
                <div className="absolute left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {dropdownTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowMoreMenu(false);
                        }}
                        className={`
                          w-full flex items-center px-4 py-2 text-sm
                          ${isActive
                            ? 'text-primary bg-primary/5 dark:bg-primary/10'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Active Tab Content */}
      <div>
        <ActiveComponent />
      </div>
    </div>
  );
}