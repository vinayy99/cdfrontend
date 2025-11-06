import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import * as api from '../services/api';

const Header: React.FC = () => {
  const { currentUser, token, logout } = useAppContext();
  const [unread, setUnread] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<api.NotificationItem[]>([]);

  React.useEffect(() => {
    const load = async () => {
      if (!token) { setUnread(0); setItems([]); return; }
      try {
        const [count, list] = await Promise.all([
          api.getUnreadCount(token),
          api.getNotifications(token)
        ]);
        setUnread(count); setItems(list);
      } catch { /* ignore */ }
    };
    load();
  }, [token]);

  const markAll = async () => {
    if (!token) return;
    try { await api.markAllNotificationsRead(token); setUnread(0); setItems(prev => prev.map(i => ({ ...i, read_at: i.read_at || new Date().toISOString() }))); } catch {}
  };
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const activeLinkStyle = { color: '#3B82F6', borderBottom: '2px solid #3B82F6' } as const;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={currentUser ? "/dashboard" : "/"} className="text-2xl font-bold text-primary">CollabMate</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {currentUser && (
                <>
                  <NavLink to="/discover" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition">Discover</NavLink>
                  <NavLink to="/projects/new" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition">Create Project</NavLink>
                  <NavLink to="/profile/edit" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition">Profile</NavLink>
                  <NavLink to="/skill-swaps" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition">Skill Swaps</NavLink>
                  <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition">Dashboard</NavLink>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button onClick={() => setOpen(!open)} className="relative px-2 py-1 rounded hover:bg-gray-100">
                    <span className="material-icons">notifications</span>
                    {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{unread}</span>}
                  </button>
                  {open && (
                    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md border z-50">
                      <div className="flex items-center justify-between px-3 py-2 border-b">
                        <span className="font-semibold text-sm">Notifications</span>
                        <button onClick={markAll} className="text-xs text-primary hover:underline">Mark all read</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {items.length === 0 ? (
                          <p className="p-3 text-sm text-gray-500">No notifications</p>
                        ) : items.map(n => (
                          <div key={n.id} className={`px-3 py-2 text-sm ${n.read_at ? 'bg-white' : 'bg-blue-50'}`}>
                            <p className="font-medium text-gray-800">{n.title}</p>
                            {n.body && <p className="text-gray-600">{n.body}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <img className="h-8 w-8 rounded-full" src={currentUser.avatar} alt="User Avatar" />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Welcome, {currentUser.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition">Logout</button>
              </div>
            ) : (
              <Link to="/auth" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Login / Sign Up</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;



