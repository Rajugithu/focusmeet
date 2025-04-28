// client/src/components/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'wouter'; 

const Sidebar: React.FC = () => {
  const location = useLocation()[0];

  const isActive = (path: string) => {
    return location === path ? 'bg-gray-200' : '';
  }; 

  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-4">Menu</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className={`block p-2 rounded hover:bg-gray-200 ${isActive('/dashboard')}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className={`block p-2 rounded hover:bg-gray-200 ${isActive('/profile')}`}
            >
              Profile
            </Link>
          </li>
          <li>
          </li>
          <li>
            <Link
              href="/classes"
              className={`block p-2 rounded hover:bg-gray-200 ${isActive('/classes')}`}
            >
              Courses
            </Link>
          </li>
         </ul>
      </nav>
    </div>
  );
};

export default Sidebar;