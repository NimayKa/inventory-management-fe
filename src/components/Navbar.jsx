import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fas, far, fab);

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'gauge-high' },
    { label: 'Inventory', href: '/inventory', icon: 'boxes-stacked' },
    { label: 'Log', href: '/log', icon: 'clock-rotate-left' },
    { label: 'Report a Bug', href: '/report', icon: 'circle-exclamation' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="flex flex-col w-64 min-h-screen shadow-xl shrink-0 bg-gray-100 text-cyan-700">

        <div className="px-5 py-6 border-b border-cyan-700 ">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest font-medium">
                Inventory Management
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-cyan-700 text-white shadow-md'
                    : ' hover:bg-gray-400 hover:text-white'
                  }`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-cyan-700">
          <button
            onClick={() => {/* handle logout */}}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
          >
            <FontAwesomeIcon icon="right-from-bracket" className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}