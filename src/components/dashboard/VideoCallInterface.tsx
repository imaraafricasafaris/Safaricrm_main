import React from 'react';
import { Mail, Phone, X } from 'lucide-react';
import GoogleMeetIcon from '../icons/GoogleMeetIcon';

interface VideoCallInterfaceProps {
  avatar: string;
  name: string;
  email: string;
  phoneNumber: string;
  onClose: () => void;
}

export default function VideoCallInterface({ avatar, name, email, phoneNumber, onClose }: VideoCallInterfaceProps) {
  const handleEmailClick = () => {
    window.location.href = `mailto:${email}`;
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="relative w-full h-[120px] rounded-2xl overflow-hidden">
      {/* Video Container */}
      <div className="absolute inset-0">
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Controls */}
      <div className="absolute inset-0">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 text-white/90 hover:text-white transition-colors z-10 group"
        >
          <X className="w-4 h-4" />
          <span className="pointer-events-none absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            Close window
          </span>
        </button>

        {/* Center Name */}
        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2">
          <span className="text-sm text-white/90 font-medium px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
            {name}
          </span>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <button
            onClick={() => window.open('https://meet.google.com/new', '_blank')}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors group"
          >
            <GoogleMeetIcon className="w-6 h-6" />
            <span className="pointer-events-none absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Start Google Meet
            </span>
          </button>

          <button
            onClick={handleEmailClick}
            className="p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors group"
          >
            <Mail className="w-4 h-4" />
            <span className="pointer-events-none absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Send email
            </span>
          </button>

          <button
            onClick={handlePhoneClick}
            className="p-3 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white transition-colors group"
          >
            <Phone className="w-4 h-4" />
            <span className="pointer-events-none absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Call contact
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}