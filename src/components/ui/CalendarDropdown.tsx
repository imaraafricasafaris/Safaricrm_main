import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors relative group"
      >
        <CalendarIcon className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 z-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div
                    key={day}
                    className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {[...Array(firstDayOfMonth)].map((_, index) => (
                  <div key={`empty-${index}`} className="h-8" />
                ))}
                {[...Array(daysInMonth)].map((_, index) => {
                  const day = index + 1;
                  const isToday = 
                    day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

                  return (
                    <button
                      key={day}
                      className={`
                        h-8 rounded-lg text-sm
                        ${isToday
                          ? 'bg-primary text-black font-medium'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                        }
                        transition-colors
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 p-3">
              <button
                onClick={() => setCurrentDate(new Date())}
                className="w-full px-3 py-1.5 text-sm text-primary hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}