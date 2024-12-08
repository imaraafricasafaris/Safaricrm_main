import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, Check } from 'lucide-react';

interface FileUploadModalProps {
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export default function FileUploadModal({ onClose, onUpload }: FileUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    const validExtensions = ['.csv', '.tsv'];
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(extension)) {
      throw new Error('Please upload a CSV or TSV file');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size must be less than 10MB');
    }
    
    return true;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      validateFile(file);
      setSelectedFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateFile(file);
      setSelectedFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      validateFile(selectedFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid file');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      // Show loading message
      const loadingMessage = document.createElement('div');
      loadingMessage.className = 'fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg';
      loadingMessage.textContent = 'Importing leads...';
      document.body.appendChild(loadingMessage);
      
      await onUpload(selectedFile);
      
      // Show success message
      loadingMessage.textContent = 'Import completed successfully!';
      loadingMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg';
      setTimeout(() => document.body.removeChild(loadingMessage), 3000);
      
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Import Leads from CSV
          </h3>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>

              {selectedFile ? (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white animate-fadeIn">
                  <FileText className="w-4 h-4" />
                  {selectedFile.name}
                </div>
              ) : (
                <>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Drop your CSV file here or{' '}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary hover:text-primary/90"
                    >
                      select file
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {selectedFile && !error && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-200 text-sm rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              Ready to import {selectedFile.name}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="px-6 py-2 bg-primary text-black rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Import
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}