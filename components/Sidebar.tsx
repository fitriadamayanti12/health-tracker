'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  History, 
  BarChart3, 
  User, 
  LogOut, 
  Activity,
  FileText,
  Pill,
  Heart,
  PlusCircle,
  Bell,
  Target
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/add', label: 'Tambah Catatan', icon: PlusCircle },
  { href: '/target', label: 'Target Gula', icon: Target },
  { href: '/history', label: 'Riwayat', icon: History },
  { href: '/statistics', label: 'Statistik', icon: BarChart3 },
  { href: '/symptoms', label: 'Gejala', icon: Activity },
  { href: '/medications', label: 'Obat', icon: Pill },
  { href: '/reminder', label: 'Pengingat', icon: Bell },
  { href: '/report', label: 'Laporan', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting user:', error);
          setUser(null);
        } else {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setUser(null);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r shadow-sm z-50 flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          <h1 className="text-xl font-bold text-gray-800">Health Tracker</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">Track your health, stay healthy</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-base font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 truncate">
              {user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-base font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}