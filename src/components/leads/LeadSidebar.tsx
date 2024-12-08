import React from 'react';
import { 
  Users, Star, Clock, Import, UserX, BellRing, Briefcase, Users2, 
  UserCheck, Archive, Trash2, Crown, UsersRound, Gift, Compass, Heart,
  UserCog, History, Upload, Bell, Activity, UserMinus, Gem,
  UserPlus, MapPin
} from 'lucide-react';

const categories = [
  // Lead Status
  { id: 'new', label: 'New Leads', icon: UserPlus, count: 12 },
  { id: 'priority', label: 'Priority Leads', icon: Star, count: 8 },
  { id: 'my-leads', label: 'My Leads', icon: UserCheck, count: 24 },
  { id: 'untouched', label: 'Untouched Leads', icon: UserX, count: 5 },
  
  // Recent Activity
  { id: 'recent', label: 'Recently Modified', icon: History, count: 7 },
  { id: 'imported', label: 'Recently Imported', icon: Upload, count: 3 },
  { id: 'follow-up', label: 'Need Follow-Up', icon: Bell, count: 9 },
  
  // Lead Categories
  { id: 'active', label: 'Active Leads', icon: Activity, count: 42 },
  { id: 'inactive', label: 'Inactive Leads', icon: Archive, count: 18 },
  { id: 'bounced', label: 'Bounced Leads', icon: UserMinus, count: 4 },
  
  // Safari Types
  { id: 'luxury', label: 'Luxury Safaris', icon: Gem, count: 6 },
  { id: 'family', label: 'Family Safaris', icon: Users, count: 11 },
  { id: 'groups', label: 'Group Tours', icon: UsersRound, count: 8 },
  { id: 'special', label: 'Special Occasions', icon: Gift, count: 5 },
  
  // Territory & Management
  { id: 'territory', label: 'Territory Leads', icon: MapPin, count: 15 },
  { id: 'qualified', label: 'Qualified Leads', icon: UserCog, count: 15 },
  { id: 'recycle', label: 'Recycle Bin', icon: Trash2, count: 23 }
];

export default function LeadSidebar() {
  const [selectedCategory, setSelectedCategory] = React.useState('new');
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className={`fixed inset-0 z-50 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsVisible(false)} />
      <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-80 max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-l-xl shadow-2xl transform ${isVisible ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Lead Categories</h2>
        </div>
        <nav className="p-4 grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-black'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <category.icon className="w-4 h-4" />
                <span>{category.label}</span>
              </div>
              <span className="bg-black/10 px-2 py-0.5 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}