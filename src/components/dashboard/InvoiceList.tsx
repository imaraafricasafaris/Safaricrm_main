import React from 'react';
import { DollarSign, FileText, Download, ExternalLink } from 'lucide-react';

const invoices = [
  {
    id: 'INV-2024-001',
    client: 'Microsoft Corp.',
    amount: 50000,
    status: 'paid',
    date: '2024-03-15',
  },
  {
    id: 'INV-2024-002',
    client: 'Global Tech Inc.',
    amount: 75000,
    status: 'pending',
    date: '2024-03-16',
  },
  {
    id: 'INV-2024-003',
    client: 'Adventure Corp',
    amount: 35000,
    status: 'overdue',
    date: '2024-03-14',
  },
];

const statusStyles = {
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function InvoiceList() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 drag-handle cursor-move">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Invoices
          </h2>
        </div>
        <button className="text-sm text-primary hover:text-primary/90 flex items-center gap-1">
          <ExternalLink className="w-4 h-4" />
          View All
        </button>
      </div>

      <div className="space-y-2">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {invoice.client}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {invoice.id} • {invoice.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[invoice.status as keyof typeof statusStyles]}`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ${invoice.amount.toLocaleString()}
              </span>
              <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}