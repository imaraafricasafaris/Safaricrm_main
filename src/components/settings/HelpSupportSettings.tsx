import React from 'react';
import { HelpCircle, Book, MessageSquare, Phone, Mail, FileText } from 'lucide-react';

export default function HelpSupportSettings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Help & Support
        </h2>

        <div className="space-y-6">
          {/* Quick Help */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: Book,
                title: 'Documentation',
                description: 'Browse our comprehensive guides'
              },
              {
                icon: MessageSquare,
                title: 'Live Chat',
                description: 'Chat with our support team'
              },
              {
                icon: Phone,
                title: 'Phone Support',
                description: 'Call us for immediate help'
              }
            ].map((item) => (
              <button
                key={item.title}
                className="p-6 text-left bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors group"
              >
                <item.icon className="w-6 h-6 text-gray-400 group-hover:text-primary-500 mb-3" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </button>
            ))}
          </div>

          {/* Contact Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Contact Options
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-primary-500" />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Support
                  </h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Response time: Within 24 hours
                </p>
                <button className="text-sm text-primary-600 hover:text-primary-500">
                  support@safaricroms.com
                </button>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-primary-500" />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Phone Support
                  </h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Available Mon-Fri, 9AM-5PM EAT
                </p>
                <button className="text-sm text-primary-600 hover:text-primary-500">
                  +254 123 456 789
                </button>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {[
                'How do I create a new safari package?',
                'How can I manage vehicle assignments?',
                'What payment methods are supported?',
                'How do I generate reports?'
              ].map((question) => (
                <button
                  key={question}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {question}
                    </span>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Resources
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Book,
                  title: 'User Guide',
                  description: 'Complete system documentation'
                },
                {
                  icon: FileText,
                  title: 'API Documentation',
                  description: 'Integration guides and references'
                }
              ].map((resource) => (
                <button
                  key={resource.title}
                  className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors group text-left"
                >
                  <resource.icon className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {resource.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {resource.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}