import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, User, LogIn, Github, Chrome, AlertCircle, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loginWithGoogle, signUpWithEmail, signInWithEmail } = useAuth();

  const [isLogin, setIsLogin] = useState(location.state?.isLogin !== false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync isLogin with location state if it changes
  useEffect(() => {
    if (location.state?.isLogin !== undefined) {
      setIsLogin(location.state.isLogin);
    }
  }, [location.state]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      const checkProgramsAndRedirect = async () => {
        setLoading(true);
        try {
          const q = query(
            collection(db, 'programs'),
            where('userId', '==', user.uid),
            limit(1)
          );
          const querySnapshot = await getDocs(q);
          
          let targetPath = '/create';
          if (!querySnapshot.empty) {
            targetPath = '/dashboard';
          }
          
          const from = location.state?.from?.pathname || targetPath;
          navigate(from, { replace: true });
        } catch (err) {
          console.error("Error checking programs:", err);
          navigate('/create', { replace: true });
        } finally {
          setLoading(false);
        }
      };

      checkProgramsAndRedirect();
    }
  }, [user, navigate, location]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName);
      }
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerFn) => {
    setError('');
    setLoading(true);
    try {
      await providerFn();
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md relative z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'أهلاً بك مجدداً' : 'انضم إلينا اليوم'}
          </h1>
          <p className="text-white/50 text-sm">
            {isLogin ? 'سجل دخولك لمتابعة تدريبك' : 'ابدأ رحلتك الرياضية مع الذكاء الاصطناعي'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5 text-right" dir="rtl">
              <label className="text-sm font-medium text-white/70 block pr-1">الاسم</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  required
                  placeholder="محمد علي"
                  className="input-field w-full pl-12"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 text-right" dir="rtl">
            <label className="text-sm font-medium text-white/70 block pr-1">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                required
                placeholder="example@mail.com"
                className="input-field w-full pl-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 text-right" dir="rtl">
            <label className="text-sm font-medium text-white/70 block pr-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="input-field w-full pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            <span>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</span>
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#121212] px-2 text-white/40">أو عبر</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => handleSocialLogin(loginWithGoogle)}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium w-full"
          >
            <Chrome className="w-4 h-4 text-red-500" />
            <span>Google تسجيل الدخول عبر</span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm">
          <span className="text-white/50">
            {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
          </span>
          {' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? 'سجّل الآن' : 'تسجيل الدخول'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
