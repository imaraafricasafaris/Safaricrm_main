import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Zap, Settings, Plus, Search } from 'lucide-react';
import { useModules } from '../contexts/ModuleContext';
import { getEmailCampaigns, getSocialPosts, getLeadWorkflows } from '../lib/api/marketing';
import { EmailCampaign, SocialPost, LeadWorkflow } from '../types/marketing';
import toast from 'react-hot-toast';

export default function Marketing() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [workflows, setWorkflows] = useState<LeadWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isModuleActive } = useModules();

  useEffect(() => {
    if (!isModuleActive('marketing-automation')) {
      toast.error('Marketing Automation module is not active');
      return;
    }
    loadData();
  }, [isModuleActive]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [campaignsData, postsData, workflowsData] = await Promise.all([
        getEmailCampaigns(),
        getSocialPosts(),
        getLeadWorkflows()
      ]);
      setCampaigns(campaignsData);
      setSocialPosts(postsData);
      setWorkflows(workflowsData);
    } catch (error) {
      console.error('Error loading marketing data:', error);
      toast.error('Failed to load marketing data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Marketing Automation
            </h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'campaigns', label: 'Email Campaigns', icon: Mail },
              { id: 'social', label: 'Social Media', icon: Calendar },
              { id: 'workflows', label: 'Lead Workflows', icon: Zap },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className={`
                  w-5 h-5 mr-2
                  ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {campaign.subject}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      campaign.status === 'sent'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : campaign.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Recipients</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {campaign.recipient_count}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Open Rate</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {campaign.open_rate ? `${campaign.open_rate}%` : '-'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Click Rate</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {campaign.click_rate ? `${campaign.click_rate}%` : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              {socialPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {post.platform.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.scheduled_date
                            ? new Date(post.scheduled_date).toLocaleDateString()
                            : 'Draft'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : post.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.content}
                  </p>
                  {post.engagement_stats && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Likes</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {post.engagement_stats.likes}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Shares</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {post.engagement_stats.shares}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Comments</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {post.engagement_stats.comments}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'workflows' && (
            <div className="space-y-6">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {workflow.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Trigger: {workflow.trigger_type.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Toggle
                        enabled={workflow.is_active}
                        onChange={() => {/* Handle toggle */}}
                        size="sm"
                      />
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {workflow.steps.map((step, index) => (
                      <React.Fragment key={index}>
                        <div className={`p-2 rounded-lg ${
                          step.type === 'email'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            : step.type === 'task'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {step.type}
                        </div>
                        {index < workflow.steps.length - 1 && (
                          <div className="w-8 h-px bg-gray-300 dark:bg-gray-600" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Marketing Settings
              </h3>
              {/* Add settings content */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}