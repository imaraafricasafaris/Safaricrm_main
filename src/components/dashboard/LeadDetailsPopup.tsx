import React, { useState } from 'react';
import { X, Download, Edit2, ChevronUp, ChevronDown, WandIcon, Clock, FileText, Target, ArrowUpRight, Phone, MessageSquare, FileCheck, FileSignature, Calendar, DollarSign, UserCheck } from 'lucide-react';
import VideoCallInterface from './VideoCallInterface';

interface TimelineEvent {
  id: string;
  type: 'document' | 'goal' | 'communication' | 'proposal' | 'meeting' | 'payment' | 'status';
  title: string;
  timestamp: string;
  icon: React.ElementType;
  iconBgColor: string;
  content: React.ReactNode;
}

interface LeadDetailsPopupProps {
  lead: {
    id: string;
    name: string;
    avatar: string;
    documents: Array<{ name: string; url: string }>;
  };
  onClose: () => void;
}

export default function LeadDetailsPopup({ lead, onClose }: LeadDetailsPopupProps) {
  const [isMuted, setIsMuted] = useState(false);
  
  // Sample timeline events - in a real app, these would come from your backend
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'document',
      title: 'Documents',
      timestamp: '2:46',
      icon: FileCheck,
      iconBgColor: 'bg-primary',
      content: (
        <div className="grid grid-cols-2 gap-4">
          {lead.documents.map((doc, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-2 flex flex-col items-center"
            >
              <div className="w-full aspect-[3/4] bg-gray-700 rounded-lg mb-1 flex items-center justify-center">
                <Download className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-xs text-gray-400 truncate w-full text-center">
                {doc.name}
              </span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: '2',
      type: 'goal',
      title: 'Goals',
      timestamp: '2:15',
      icon: Target,
      iconBgColor: 'bg-yellow-500',
      content: (
        <div>
          <p className="text-sm text-white">Set initial meeting and discuss requirements</p>
          <p className="text-xs text-gray-500 mt-2">High priority goal with immediate action required</p>
        </div>
      )
    },
    {
      id: '3',
      type: 'meeting',
      title: 'Meeting Scheduled',
      timestamp: '1:30',
      icon: Calendar,
      iconBgColor: 'bg-blue-500',
      content: (
        <div className="space-y-2">
          <p className="text-sm text-white">Initial consultation call scheduled</p>
          <p className="text-xs text-gray-500">March 25, 2024 at 2:00 PM</p>
        </div>
      )
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Received',
      timestamp: '1:15',
      icon: DollarSign,
      iconBgColor: 'bg-green-500',
      content: (
        <div className="space-y-2">
          <p className="text-sm text-white">Deposit payment received</p>
          <p className="text-xs text-gray-500">$2,500 - Invoice #INV-2024-001</p>
        </div>
      )
    },
    {
      id: '5',
      type: 'status',
      title: 'Status Update',
      timestamp: '1:00',
      icon: UserCheck,
      iconBgColor: 'bg-purple-500',
      content: (
        <div className="space-y-2">
          <p className="text-sm text-white">Lead status changed to Qualified</p>
          <p className="text-xs text-gray-500">Updated by John Smith</p>
        </div>
      )
    }
  ];

  const [goal, setGoal] = useState('Reduce the number of security incidents by 50%');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleGoalEdit = () => {
    setIsEditingGoal(true);
    setTempGoal(goal);
  };

  const handleGoalSave = () => {
    setGoal(tempGoal);
    setIsEditingGoal(false);
  };

  const handleGoalCancel = () => {
    setTempGoal(goal);
    setIsEditingGoal(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div 
      className={`fixed bottom-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${!isVisible ? 'opacity-0 translate-y-full' : 'opacity-100 translate-y-0'}
        ${isMinimized ? 'pointer-events-auto' : ''} w-[320px]`}
    >
      <div className="relative w-[320px]">
        <div 
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 rounded-2xl
            ${isMinimized || !isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(false);
          }}
        />
      <div className={`transform transition-all duration-300 ease-in-out ${
        isMinimized ? 'translate-y-[calc(100%-60px)]' : ''
      }`}>
        <div className="w-[320px] overflow-hidden relative">
          <div className="p-1">
            <VideoCallInterface
              avatar={lead.avatar}
              name={lead.name}
              email={lead.email}
              phoneNumber={lead.phone}
              onClose={handleClose}
            />
          </div>

          {/* Content Section */}
          <div className="bg-gray-900 shadow-2xl max-h-[55vh] overflow-hidden rounded-t-2xl relative z-10">
            {/* Minimize/Maximize Handle */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }} 
                className="flex items-center justify-center w-8 h-4 text-white/80 hover:text-white transition-colors z-50 bg-gray-800/50 rounded-full"
              >
                {isMinimized ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>

            {/* Summary Section */}
            <div className="p-3 space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">Summary</h2>
                  <button
                    onClick={() => setShowAiSummary(true)}
                    className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors group relative"
                  >
                    <WandIcon className="w-[18px] h-[18px] text-primary" />
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Generate AI insights
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.location.href = `/leads/${lead.id}`}
                    className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors group relative"
                  >
                    <ArrowUpRight className="w-5 h-5 text-primary -rotate-45" />
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      View full lead details
                    </span>
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6 pb-6">
                {timelineEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full ${event.iconBgColor} flex items-center justify-center`}>
                      <event.icon className="w-3 h-3 text-black/80" />
                    </div>
                    {index < timelineEvents.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-700 absolute top-5 left-2.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">{event.title}</span>
                      <span className="text-xs text-gray-400">{event.timestamp}</span>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-3">
                      {event.content}
                    </div>
                  </div>
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* AI Summary Modal */}
      {showAiSummary && (
        <div className="absolute inset-0 bg-gray-900 rounded-2xl p-4">
          <button
            onClick={() => setShowAiSummary(false)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-800"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <WandIcon className="w-5 h-5 text-primary" />
              AI Summary
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>High-value lead showing strong interest in luxury safari packages.</p>
              <p>Key Insights:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Budget range indicates premium package potential</li>
                <li>Quick response to initial documents</li>
                <li>Engagement level suggests high conversion probability</li>
              </ul>
              <p>Suggested Next Steps:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Schedule follow-up call within 48 hours</li>
                <li>Prepare customized luxury package options</li>
                <li>Include exclusive add-ons based on preferences</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}