import { motion } from 'framer-motion';
import { Activity, Brain, Clock, Target, ArrowLeft, FileText, Sparkles, Dumbbell, Star, Check, Zap, Crown, ChevronDown } from 'lucide-react';
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

const steps = [
  {
    number: '01',
    icon: <FileText className="w-10 h-10" />,
    title: 'أدخل بياناتك',
    desc: 'أجب على أسئلة بسيطة عن عمرك ورياضتك ومستواك وأهدافك.',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    number: '02',
    icon: <Sparkles className="w-10 h-10" />,
    title: 'الذكاء الاصطناعي يعمل',
    desc: 'في ثوانٍ معدودة، يقوم الذكاء الاصطناعي بتصميم برنامج متكامل خصيصاً لك.',
    color: 'from-violet-500 to-purple-400'
  },
  {
    number: '03',
    icon: <Dumbbell className="w-10 h-10" />,
    title: 'ابدأ التدريب',
    desc: 'احصل على جدول أسبوعي مفصل مع تمارين وتغذية ونصائح استشفاء.',
    color: 'from-emerald-500 to-teal-400'
  }
];

const testimonials = [
  {
    name: 'عمر السيد',
    role: 'لاعب كرة قدم — الأهلي',
    avatar: '⚽',
    text: 'AthleteAI غيّر طريقة تدريبي بالكامل. البرنامج المخصص ساعدني على تحسين لياقتي البدنية وسرعتي في الملعب خلال أسابيع قليلة.',
    stars: 5
  },
  {
    name: 'نورة الحربي',
    role: 'بطلة كاراتيه — المنتخب السعودي',
    avatar: '🥋',
    text: 'كنت أبحث عن أداة ذكية تفهم متطلبات رياضتي. AthleteAI يقدم لي برامج تراعي الإحماء والاستشفاء وتركز على نقاط قوتي.',
    stars: 5
  },
  {
    name: 'أحمد الزعبي',
    role: 'لاعب كمال أجسام — بطل الأردن',
    avatar: '💪',
    text: 'الجدول التدريبي دقيق ومبني على أسس علمية. النصائح الغذائية وحدها تستحق الاشتراك. أنصح كل رياضي بتجربته!',
    stars: 5
  }
];

const pricingPlans = [
  {
    name: 'الباقة المجانية',
    nameEn: 'Free',
    price: '$0',
    period: 'مجاناً',
    features: [
      'جدول تدريب أسبوعي',
      'نصائح غذائية عامة',
      'دعم رياضة واحدة',
      'برنامج واحد في الشهر'
    ],
    cta: 'ابدأ مجاناً',
    ctaLink: '/create',
    highlighted: false,
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-slate-500/20 to-slate-600/20',
    borderColor: 'border-white/10'
  },
  {
    name: 'باقة بلس',
    nameEn: 'Plus',
    price: '$4.99',
    period: 'شهرياً',
    features: [
      'برامج تدريب غير محدودة',
      'تحليل نقاط القوة والضعف',
      'دعم 3 رياضات',
      'خطط غذائية مخصصة',
      'تتبع التقدم'
    ],
    cta: 'قريباً',
    ctaLink: null,
    highlighted: true,
    badge: 'الأكثر طلباً',
    icon: <Star className="w-6 h-6" />,
    gradient: 'from-primary/20 to-accent/20',
    borderColor: 'border-primary'
  },
  {
    name: 'باقة المحترفين',
    nameEn: 'Pro',
    price: '$9.99',
    period: 'شهرياً',
    features: [
      'كل مميزات بلس',
      'دعم جميع الرياضات والمراكز',
      'تتبع الإصابات والتعافي',
      'استشارات ذكاء اصطناعي 24/7',
      'دعم فريق كامل',
      'تقارير أداء متقدمة'
    ],
    cta: 'قريباً',
    ctaLink: null,
    highlighted: false,
    icon: <Crown className="w-6 h-6" />,
    gradient: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30'
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Small badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>مدعوم بالذكاء الاصطناعي</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-primary-300 to-white text-transparent bg-clip-text">
              مدربك الرياضي <span className="text-primary">الذكي</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed mt-8">
              احصل على برنامج تدريبي متكامل ومخصص لك في ثوانٍ باستخدام أحدث تقنيات الذكاء الاصطناعي.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/create" className="btn-primary w-full sm:w-auto text-lg flex items-center justify-center gap-2 group">
                <span>جرّب مجاناً الآن</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <button onClick={scrollToFeatures} className="btn-outline w-full sm:w-auto text-lg">
                اكتشف المميزات
              </button>
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-8 md:gap-16 mt-16 text-center"
            >
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">+2,500</div>
                <div className="text-white/50 text-sm mt-1">رياضي مسجّل</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-accent">+10,000</div>
                <div className="text-white/50 text-sm mt-1">برنامج مُولَّد</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-green-400">+15</div>
                <div className="text-white/50 text-sm mt-1">رياضة مدعومة</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-6 h-6 text-white/30" />
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

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">كيف <span className="text-primary">يعمل؟</span></h2>
              <p className="text-white/60 max-w-2xl mx-auto">ثلاث خطوات بسيطة للحصول على برنامجك التدريبي المثالي</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative group"
              >
                {/* Connector line (hidden on mobile and after last item) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -left-4 w-8 h-px bg-gradient-to-l from-white/20 to-transparent z-0"></div>
                )}
                
                <div className="card text-center relative z-10 hover:-translate-y-2 transition-all duration-300">
                  {/* Step number */}
                  <div className="absolute -top-4 right-4 text-6xl font-black text-white/[0.03] select-none">{step.number}</div>
                  
                  {/* Icon circle */}
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>

                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA after steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/create" className="btn-primary text-lg inline-flex items-center gap-2 group">
              <span>جرّب مجاناً الآن</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-dark-bg/80 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">ماذا يقول <span className="text-accent">رياضيونا</span>؟</h2>
              <p className="text-white/60 max-w-2xl mx-auto">آراء حقيقية من رياضيين يستخدمون AthleteAI لتطوير أدائهم</p>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="card relative hover:-translate-y-2 transition-all duration-300"
              >
                {/* Decorative quote */}
                <div className="absolute top-4 left-4 text-5xl text-white/[0.05] font-serif select-none">"</div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-white/80 leading-relaxed mb-6 text-sm min-h-[80px]">
                  {testimonial.text}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{testimonial.name}</div>
                    <div className="text-white/50 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">خطط <span className="text-primary">الأسعار</span></h2>
              <p className="text-white/60 max-w-2xl mx-auto">اختر الخطة المناسبة لأهدافك — ابدأ مجاناً بدون أي التزام</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`card ${plan.borderColor} relative ${plan.highlighted ? 'md:-translate-y-4 shadow-2xl shadow-primary/20 bg-gradient-to-br from-dark-card to-primary/10' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-b-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="p-2">
                  {/* Icon & Name */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 text-white ${plan.highlighted ? 'text-primary' : 'text-white/70'}`}>
                    {plan.icon}
                  </div>
                  
                  <div className="text-lg font-bold mb-1">{plan.name}</div>
                  <div className="text-xs text-white/40 mb-4">{plan.nameEn}</div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/50 text-sm mr-2">/ {plan.period}</span>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                        <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-primary' : 'text-green-400'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.ctaLink ? (
                    <Link to={plan.ctaLink} className={`${plan.highlighted ? 'btn-primary' : 'btn-outline'} w-full block text-center`}>
                      {plan.cta}
                    </Link>
                  ) : (
                    <button disabled className={`${plan.highlighted ? 'btn-primary' : 'btn-outline'} w-full opacity-50 cursor-not-allowed`}>
                      {plan.cta}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>

        <div className="container mx-auto px-4 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              <span>ابدأ رحلتك الآن</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">جاهز لتطوير أدائك الرياضي؟</h2>
            <p className="text-white/60 text-lg mb-10">
              لا تحتاج لبطاقة ائتمان. أنشئ برنامجك الأول مجاناً في أقل من دقيقة.
            </p>
            <Link to="/create" className="btn-primary text-lg inline-flex items-center gap-2 group px-10 py-4">
              <span>جرّب مجاناً الآن</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
