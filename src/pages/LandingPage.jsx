import { motion } from 'framer-motion';
import { Activity, Brain, Clock, Target, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: 'ذكاء اصطناعي مخصص',
    desc: 'برامج تدريبية تصمم خصيصاً لك بناءً على بياناتك وأهدافك الشخصية.'
  },
  {
    icon: <Target className="w-8 h-8 text-accent" />,
    title: 'تغطية شاملة للرياضات',
    desc: 'من كرة القدم والسلة إلى كمال الأجسام والجري. ندعم مختلف الرياضات.'
  },
  {
    icon: <Clock className="w-8 h-8 text-green-400" />,
    title: 'جدول مرن',
    desc: 'اختر أيام التدريب التي تناسبك، وسيقوم الذكاء الاصطناعي بتنظيم أيام الراحة.'
  },
  {
    icon: <Activity className="w-8 h-8 text-purple-400" />,
    title: 'نصائح غذائية واستشفاء',
    desc: 'نظام متكامل لا يقتصر على التمرين بل يشمل التغذية والتعافي لتجنب الإصابات.'
  }
];

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-primary-300 to-white text-transparent bg-clip-text">
              مدربك الرياضي <span className="text-primary">الذكي</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed mt-8">
              احصل على برنامج تدريبي متكامل ومخصص لك في ثوانٍ باستخدام أحدث تقنيات الذكاء الاصطناعي.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" className="btn-primary w-full sm:w-auto text-lg flex items-center justify-center gap-2 group">
                <span>سجّل الآن مجاناً</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <button onClick={scrollToFeatures} className="btn-outline w-full sm:w-auto text-lg">
                اكتشف المميزات
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-dark-bg/80 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا <span className="text-accent">AthleteAI</span>؟</h2>
            <p className="text-white/60 max-w-2xl mx-auto">تصميم علمي مدروس يعتمد على بياناتك الدقيقة لتقديم أفضل نتيجة ممكنة.</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants} className="card hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">خطط الأسعار</h2>
            <p className="text-white/60">اختر الخطة المناسبة لأهدافك</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="card w-full md:w-1/2 p-8 border-white/10 opacity-90">
              <div className="text-2xl font-bold mb-2">الباقة الأساسية</div>
              <div className="text-4xl font-bold text-primary mb-6">$0 <span className="text-sm text-white/50 font-normal">/ مجاناً</span></div>
              <ul className="mb-8 space-y-4 text-white/70">
                <li className="flex items-center gap-2">✓ جدول تدريب أسبوعي</li>
                <li className="flex items-center gap-2">✓ نصائح غذائية عامة</li>
                <li className="flex items-center gap-2">✓ دعم رياضة واحدة</li>
              </ul>
              <Link to="/create" className="btn-outline w-full block text-center">ابدأ الآن</Link>
            </div>

            {/* Pro Tier */}
            <div className="card w-full md:w-1/2 p-8 border-primary relative transform md:-translate-y-4 shadow-2xl shadow-primary/20 bg-gradient-to-br from-dark-card to-primary/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-b-lg">
                الأكثر طلباً
              </div>
              <div className="text-2xl font-bold mb-2">باقة المحترفين</div>
              <div className="text-4xl font-bold text-primary mb-6">$7.99 <span className="text-sm text-white/50 font-normal">/ شهرياً</span></div>
              <ul className="mb-8 space-y-4 text-white/90">
                <li className="flex items-center gap-2">✓ برامج لانهائية متقدمة</li>
                <li className="flex items-center gap-2">✓ تتبع التقدم والإصابات</li>
                <li className="flex items-center gap-2">✓ دعم جميع الرياضات والمراكز</li>
                <li className="flex items-center gap-2">✓ استشارات ذكاء اصطناعي 24/7</li>
              </ul>
              <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed">قريباً</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
