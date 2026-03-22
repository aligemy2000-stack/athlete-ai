import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { 
  Activity, Calendar, Target, Download, Plus, 
  ChevronRight, Loader2, Trash2, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'programs'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedPrograms = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPrograms(fetchedPrograms);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError("Failed to load your programs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [user]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    
    try {
      await deleteDoc(doc(db, 'programs', id));
      setPrograms(programs.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting program:", err);
      alert("Failed to delete program.");
    }
  };

  const handleReDownload = (e, programData) => {
    e.stopPropagation();
    // Navigate to results page with this program's data to trigger print
    navigate('/results', { state: { formData: programData.formData, existingProgram: programData.program, autoPrint: true } });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-white/50 animate-pulse">Loading your training programs...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 text-transparent bg-clip-text">
            My Training Dashboard
          </h1>
          <p className="text-white/50">Manage your personalized AI workout plans</p>
        </div>
        <Link 
          to="/create" 
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-5 h-5" />
          <span>New Program</span>
        </Link>
      </div>

      {error ? (
        <div className="card p-8 border-red-500/20 bg-red-500/5 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-white underline hover:text-primary transition-colors"
          >
            Try Refreshing
          </button>
        </div>
      ) : programs.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No programs found</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            You haven&apos;t generated any training programs yet. Start now and let our AI coach build a plan for you.
          </p>
          <Link to="/create" className="btn-primary inline-flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {programs.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate('/results', { state: { formData: p.formData, existingProgram: p.program } })}
                className="card group cursor-pointer hover:border-primary/50 transition-all hover:translate-y-[-4px] flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleReDownload(e, p)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, p.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                      title="Delete Program"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-1">{p.formData?.sport}</h3>
                  <p className="text-accent text-sm font-medium mb-4 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    {Array.isArray(p.formData?.goals) ? p.formData.goals[0] : p.formData?.goal || 'General Fitness'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-sm text-primary font-medium group-hover:text-primary-light transition-colors">
                  <span>View Program</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
