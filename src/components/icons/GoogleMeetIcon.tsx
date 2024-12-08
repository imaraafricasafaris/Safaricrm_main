import React from 'react';

export default function GoogleMeetIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className={className}
    >
      <path fill="#00832d" d="M8,12L40,12A4,4 0,0 1,44 16L44,32A4,4 0,0 1,40 36L8,36A4,4 0,0 1,4 32L4,16A4,4 0,0 1,8 12z"/>
      <path fill="#fff" d="M8,17L8,31A1,1 0,0 0,9 32L35,32A1,1 0,0 0,36 31L36,17A1,1 0,0 0,35 16L9,16A1,1 0,0 0,8 17z"/>
      <path fill="#1e8e3e" d="M44,24L44,32A4,4 0,0 1,40 36L8,36A4,4 0,0 1,4 32L4,24z"/>
      <path fill="#00832d" d="M44,23L36,23L36,17A1,1 0,0 1,37 16L43,16A1,1 0,0 1,44 17z"/>
      <path fill="#fff" d="M40,28L40,20A1,1 0,0 1,41 19L47,19A1,1 0,0 1,48 20L48,28A1,1 0,0 1,47 29L41,29A1,1 0,0 1,40 28z"/>
      <path fill="#1e8e3e" d="M44,20L44,28A1,1 0,0 1,43 29L41,29A1,1 0,0 1,40 28L40,20A1,1 0,0 1,41 19L43,19A1,1 0,0 1,44 20z"/>
    </svg>
  );
}