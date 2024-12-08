import React from 'react';

interface ColorSchemeProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  onPrimaryChange: (color: string) => void;
  onSecondaryChange: (color: string) => void;
  onAccentChange: (color: string) => void;
}

export default function ColorScheme({
  primaryColor,
  secondaryColor,
  accentColor,
  onPrimaryChange,
  onSecondaryChange,
  onAccentChange,
}: ColorSchemeProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Color Scheme
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <ColorPicker
          label="Primary Color"
          value={primaryColor}
          onChange={onPrimaryChange}
        />
        <ColorPicker
          label="Secondary Color"
          value={secondaryColor}
          onChange={onSecondaryChange}
        />
        <ColorPicker
          label="Accent Color"
          value={accentColor}
          onChange={onAccentChange}
        />
      </div>
    </div>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div>
      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );
}