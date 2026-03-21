import { Link } from 'react-router-dom';
import { Activity, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-primary transition-colors">
          <Activity className="w-6 h-6 text-primary" />
          <span>AthleteAI</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                لوحة التحكم
              </Link>
              <Link to="/create" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                إنشاء برنامج
              </Link>
              <div className="hidden sm:flex items-center gap-2 text-sm text-white/70 border-l border-white/10 pl-4 h-6">
                <User className="w-4 h-4" />
                <span>{user.displayName || user.email?.split('@')[0]}</span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/auth" 
                state={{ isLogin: true }}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link 
                to="/auth" 
                state={{ isLogin: false }}
                className="btn-primary text-sm py-2 px-5"
              >
                سجّل الآن
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
