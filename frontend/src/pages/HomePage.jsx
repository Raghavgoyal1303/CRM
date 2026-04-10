import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Square,
  Menu,
  X,
  Check,
  ShieldAlert,
  Users,
  History,
  Target,
  Zap,
  TrendingUp,
  PhoneIncoming,
  ArrowRight,
  User,
  Quote
} from 'lucide-react';
import UserMenu from '../components/shared/UserMenu';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const menuItems = ['Features', 'Pricing'];

  const dashboardPath = user?.role === 'superadmin' ? '/super/dashboard' : user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <div className="bg-[#F9F7F4] min-h-screen font-body text-[#1A1A2E] selection:bg-[#EEF2FF] selection:text-primary">
      {/* 1. Navbar */}
      <nav className="fixed top-0 inset-x-0 bg-white border-b border-[#F0EEF8] z-50 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Square className="text-white fill-white" size={20} />
            </div>
            <span className="font-heading font-black text-2xl tracking-tight text-primary">Tricity Verified</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {menuItems.map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold text-[#6B7280] hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                <UserMenu />
                <Link
                  to={dashboardPath}
                  className="bg-primary text-white px-6 py-3 rounded-[12px] text-sm font-bold shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                >
                  Go to Dashboard <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-[#6B7280] hover:text-primary transition-colors">
                  Login
                </Link>
                <Link
                  to="/login"
                  className="bg-primary text-white px-6 py-3 rounded-[12px] text-sm font-bold shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 inset-x-0 bg-white border-b border-[#F0EEF8] p-6 flex flex-col gap-4 md:hidden shadow-xl"
            >
              {menuItems.map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-lg font-bold text-[#1A1A2E]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link to="/login" className="text-lg font-bold text-[#1A1A2E]">Login</Link>
              <Link to="/login" className="bg-primary text-white p-4 rounded-[12px] text-center font-bold">Get Started Free</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-20">
        {/* 2. Hero Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
          <motion.div {...fadeIn}>
            <div className="inline-flex items-center gap-2 bg-[#EEF2FF] text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8">
              <Zap size={14} className="fill-primary" /> Built for Real Estate Teams
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6 leading-tight">
              Turn Every Call Into <br /> <span className="text-primary">a Closed Deal</span>
            </h1>
            <p className="text-[#6B7280] text-lg md:text-xl max-w-[560px] mx-auto leading-relaxed mb-10">
              Tricity Verified automatically captures leads from your Exotel calls, assigns them to your team, and tracks every follow-up â€” so no lead ever slips through.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/login" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-[12px] text-lg font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                Start Free Trial
              </Link>
              <Link to="/login" className="w-full sm:w-auto border-2 border-primary text-primary px-8 py-4 rounded-[12px] text-lg font-bold hover:bg-primary/5 transition-all">
                See How It Works
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-[#6B7280] text-sm font-medium">
              <span className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> No credit card required</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> 14-day free trial</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Setup in 5 minutes</span>
            </div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-t-3xl border-x border-t border-[#F0EEF8] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
              {/* Browser Chrome */}
              <div className="h-12 bg-gray-50 border-b border-[#F0EEF8] px-6 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-300" />
                  <div className="w-3 h-3 rounded-full bg-amber-300" />
                  <div className="w-3 h-3 rounded-full bg-emerald-300" />
                </div>
                <div className="flex-1 max-w-md mx-auto h-7 bg-white border border-[#F0EEF8] rounded-md" />
              </div>
              {/* UI Mockup Content */}
              <div className="p-8 bg-[#F9F7F4]/50">
                <div className="flex gap-6 mb-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex-1 h-24 bg-white rounded-2xl border border-[#F0EEF8] shadow-sm animate-pulse" />
                  ))}
                </div>
                <div className="bg-white rounded-2xl border border-[#F0EEF8] shadow-sm h-80 p-6 flex flex-col gap-4">
                  <div className="h-8 w-40 bg-gray-100 rounded-lg animate-pulse" />
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex-shrink-0" />
                      <div className="flex-1 h-3 bg-gray-100 rounded-full" />
                      <div className="w-20 h-6 bg-indigo-50 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. Problem -> Solution Strip */}
        <section className="bg-[#EEF2FF] py-24 text-center px-6 overflow-hidden">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl md:text-4xl font-heading font-black mb-16 tracking-tight">Missing leads is costing you lakhs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-rose-500 shadow-sm border border-rose-100">
                  <ShieldAlert size={32} />
                </div>
                <p className="text-lg font-bold text-[#1A1A2E]">Calls come in, no one <br /> logs the lead</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-rose-500 shadow-sm border border-rose-100">
                  <History size={32} />
                </div>
                <p className="text-lg font-bold text-[#1A1A2E]">Employee forgets <br /> to follow up</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-rose-500 shadow-sm border border-rose-100">
                  <Users size={32} />
                </div>
                <p className="text-lg font-bold text-[#1A1A2E]">You have no idea what <br /> your team is doing</p>
              </div>
            </div>
            <div className="mt-16 flex flex-col items-center gap-4">
              <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary animate-bounce">
                <ArrowRight size={18} className="rotate-90" />
              </div>
              <div className="text-primary font-black uppercase tracking-[0.3em] text-xs">Tricity Verified fixes all of this</div>
            </div>
          </motion.div>
        </section>

        {/* 4. Features Section */}
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
          <motion.div {...fadeIn} className="text-center mb-20">
            <div className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4">Features</div>
            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-tight">Everything your sales team needs</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: PhoneIncoming, title: 'Auto Lead Capture', desc: 'Every Exotel call instantly becomes a lead â€” no manual entry', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
              { icon: Users, title: 'Smart Assignment', desc: 'Round-robin auto-assigns leads to available employees', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
              { icon: Zap, title: '1-Tap Status Updates', desc: 'Employees update lead status in one tap, no complicated forms', color: 'bg-amber-50 text-amber-600 border-amber-100' },
              { icon: ShieldAlert, title: 'Missed Call Alerts', desc: 'Never miss a lead â€” instant notifications for missed calls', color: 'bg-rose-50 text-rose-600 border-rose-100' },
              { icon: History, title: 'Full Call Timeline', desc: 'See every call, note, and recording per lead in one place', color: 'bg-purple-50 text-purple-600 border-purple-100' },
              { icon: TrendingUp, title: 'Team Analytics', desc: 'Track conversion rates and performance for every employee', color: 'bg-blue-50 text-blue-600 border-blue-100' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-[24px] border border-[#F0EEF8] shadow-sm hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-900/5 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-transform group-hover:scale-110 ${f.color}`}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">{f.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. How It Works */}
        <section className="py-24 px-6 max-w-5xl mx-auto overflow-hidden">
          <motion.div {...fadeIn} className="text-center mb-20 text-4xl md:text-5xl font-heading font-black tracking-tight leading-tight">
            Up and running in 3 steps
          </motion.div>

          <div className="relative flex flex-col md:flex-row gap-16 md:gap-8 justify-between items-start">
            {/* Dashed Line Background (Desktop Only) */}
            <div className="hidden md:block absolute top-12 left-20 right-20 border-t-2 border-dashed border-[#F0EEF8] z-0" />

            {[
              { n: '01', title: 'Connect Exotel', desc: 'Point your webhook at Tricity Verified, takes less than 2 minutes.' },
              { n: '02', title: 'Add Your Team', desc: 'Invite employees, they get login access instantly.' },
              { n: '03', title: 'Watch Leads Flow', desc: 'Every call auto-captured, assigned, and tracked.' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex-1 flex flex-col items-center md:items-start text-center md:text-left"
              >
                <div className="w-24 h-24 bg-white rounded-full border-4 border-primary flex items-center justify-center text-primary font-heading font-black text-3xl mb-8 shadow-xl shadow-[#EEF2FF]">
                  {s.n}
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">{s.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. Pricing Section */}
        <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-tight mb-4">Simple, honest pricing</h2>
            <p className="text-[#6B7280] text-lg">Cancel anytime. No hidden fees.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Starter', price: '2,999', limit: 'Up to 5', features: ['Auto Lead Capture', 'Smart Round-Robin', 'Basic Analytics', 'Standard Support', 'Mobile CRM Access'] },
              { name: 'Growth', price: '5,999', limit: 'Up to 15', featured: true, features: ['Everything in Starter', 'Custom Lead Routing', 'Advanced Analytics', 'Missed call SMS alerts', 'Priority Support'] },
              { name: 'Pro', price: '9,999', limit: 'Unlimited', features: ['Everything in Growth', 'Dedicated Account Manager', 'Multi-branch Support', 'API Access', 'Enterprise SLA'] },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white p-10 rounded-[32px] border transition-all hover:shadow-2xl hover:shadow-indigo-900/10 ${p.featured ? 'border-primary ring-4 ring-primary/5' : 'border-[#F0EEF8]'}`}
              >
                {p.featured && (
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-white text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-heading font-bold mb-6 text-[#6B7280]">{p.name}</h3>
                <div className="text-[#6B7280] text-sm font-bold italic mb-6">Contact for pricing</div>
                <div className="text-sm font-bold text-primary mb-10 flex items-center gap-1.5">
                  <Users size={16} /> {p.limit} employees
                </div>

                <div className="space-y-5 mb-10">
                  {p.features.map(f => (
                    <div key={f} className="flex gap-3 text-sm font-medium">
                      <Check size={18} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-[#1A1A2E]">{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/login"
                  className={`w-full flex items-center justify-center py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-xs transition-all ${p.featured ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'border-2 border-primary text-primary hover:bg-primary/5'}`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. Testimonials */}
        <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl font-heading font-black tracking-tight leading-tight">Trusted by real estate teams</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sameer Desai', company: 'Desai Properties', text: 'Tricity Verified has been a game-changer for our sales team. We were losing at least 10 leads a week due to unrecorded calls. Now every call is a lead.', initials: 'SD' },
              { name: 'Anjali Gupta', company: 'UrbanNest Realty', text: 'The round-robin assignment is incredibly fair and efficient. My agents are more motivated because the system tracks their performance objectively.', initials: 'AG' },
              { name: 'Karan Mehra', company: 'SkyHigh Estates', text: 'Simplest CRM I have ever used. Setup took literally 5 minutes and the employee app is so intuitive that no one needed training.', initials: 'KM' },
            ].map((t, i) => (
              <motion.div
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[32px] border border-[#F0EEF8] shadow-sm relative group"
              >
                <Quote className="absolute top-8 right-10 text-[#EEF2FF] rotate-180 transition-transform group-hover:scale-125" size={40} />
                <p className="text-lg leading-relaxed italic text-[#1A1A2E] mb-10 relative z-10">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#EEF2FF] text-primary rounded-full flex items-center justify-center font-black text-sm border-2 border-white shadow-sm">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-[#1A1A2E]">{t.name}</div>
                    <div className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">{t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 8. CTA Strip */}
        <section className="py-24 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto bg-primary rounded-[48px] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px] -ml-32 -mb-32" />

            <h2 className="text-4xl md:text-6xl font-heading font-black mb-6 leading-tight relative z-10">Ready to never miss <br /> a lead again?</h2>
            <p className="text-[#C7D2FE] text-lg md:text-xl font-medium mb-12 relative z-10">Join growing real estate teams already using Tricity Verified</p>

            <Link to="/login" className="inline-flex items-center justify-center bg-white text-primary px-10 py-5 rounded-[20px] text-xl font-black shadow-xl hover:-translate-y-1 transition-all relative z-10">
              Start Your Free Trial
            </Link>
          </motion.div>
        </section>

        {/* 9. Footer */}
        <footer className="bg-white border-t border-[#F0EEF8] py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-md">
                    <Square className="fill-white" size={16} />
                  </div>
                  <span className="font-heading font-black text-xl tracking-tight text-primary">Tricity Verified</span>
                </div>
                <p className="text-[#6B7280] text-sm font-medium">Â© 2025 Tricity Verified. All rights reserved.</p>
              </div>

              <div className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                Made with care for Indian real estate teams
              </div>

              <div className="flex items-center gap-8 text-sm font-bold text-[#6B7280]">
                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
              </div>
            </div>

            <div className="text-center md:text-left text-[10px] text-gray-300 font-bold uppercase tracking-widest border-t border-gray-50 pt-8">
              Tricity Verified Multi-Tenant CRM Engine v1.0.4-stable
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;

