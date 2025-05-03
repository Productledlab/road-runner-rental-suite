
import { NavLink } from 'react-router-dom';
import { 
  CarFront, 
  Users, 
  Calendar, 
  BarChart3,
  Settings,
  Archive
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-rental-600 text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Road Runner</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`
              }
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/vehicles" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`
              }
            >
              <CarFront className="h-5 w-5 mr-3" />
              <span>Vehicles</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/customers" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`
              }
            >
              <Users className="h-5 w-5 mr-3" />
              <span>Customers</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/bookings" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`
              }
            >
              <Calendar className="h-5 w-5 mr-3" />
              <span>Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/archived-vehicles" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`
              }
            >
              <Archive className="h-5 w-5 mr-3" />
              <span>Archived Vehicles</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`
              }
            >
              <Settings className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="px-6 py-4 bg-rental-700">
        <div className="text-sm">
          <p className="opacity-80">Logged in as:</p>
          <p className="font-medium">Admin User</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
