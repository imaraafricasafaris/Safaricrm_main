import React from 'react';
import { FileText, Download } from 'lucide-react';

const documents = [
  { id: '1', name: 'Q1 Safari Packages.pdf', date: '2024-03-18', size: '2.4 MB' },
  { id: '2', name: 'Wildlife Tour Guide.docx', date: '2024-03-17', size: '1.8 MB' },
  { id: '3', name: 'Client Presentation.pptx', date: '2024-03-16', size: '4.2 MB' },
];

export default function DocumentsList() {
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {doc.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {doc.date} • {doc.size}
              </p>
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
}