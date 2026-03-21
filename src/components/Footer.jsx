import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dark-bg/50 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/70">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-semibold">AthleteAI</span>
          </div>
          
          <p className="text-white/50 text-sm text-center md:text-right">
            © {new Date().getFullYear()} AthleteAI. جميع الحقوق محفوظة.
            <br />
            تم التطوير بواسطة الذكاء الاصطناعي لتطوير أدائك الرياضي.
          </p>
        </div>
      </div>
    </footer>
  );
}
