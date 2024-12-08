import React, { useState } from 'react';
import { MoreHorizontal, Mail, Phone, Shield, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { Staff } from '../../types/staff';
import StaffActions from './StaffActions';
import { useOffices } from '../../contexts/OfficeContext';

interface StaffListProps {
  staff: Staff[];
  isLoading: boolean;
}

export default function StaffList({ staff, isLoading }: StaffListProps) {
  const [activeMenu, setActiveMenu] = useState<{ id: string; position: { top: number; left: number } } | null>(null);
  const { offices } = useOffices();

  const handleActionClick = (e: React.MouseEvent, staffMember: Staff) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveMenu({
      id: staffMember.id,
      position: {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      }
    });
  };

  const getStaffOffice = (staffMember: Staff) => {
    const office = offices.find(o => o.id === staffMember.office_id);
    return office ? `${office.name} (${office.city})` : 'Not Assigned';
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Staff Member
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Branch
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {staff.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                      {member.full_name[0]}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.full_name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {member.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200">
                  {member.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Building2 className="w-4 h-4 mr-2" />
                  {getStaffOffice(member)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  member.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
                }`}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {member.last_login ? format(new Date(member.last_login), 'MMM d, yyyy HH:mm') : 'Never'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => handleActionClick(e, member)}
                  className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                {activeMenu?.id === member.id && (
                  <StaffActions
                    staff={member}
                    position={activeMenu.position}
                    onClose={() => setActiveMenu(null)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}