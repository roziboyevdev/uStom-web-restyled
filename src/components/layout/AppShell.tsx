import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../brand/Logo';
import { Home, BookOpen, GraduationCap, User as UserIcon, LogOut, Menu, X, ArrowRight, MessageSquare, Phone, MapPin } from 'lucide-react';
import { PageView } from '../../hooks/useRouter';

interface AppShellProps {
  children: React.ReactNode;
  currentView: PageView;
  onNavigate: (view: PageView, params?: { id?: string }) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, currentView, onNavigate }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: PageView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { label: 'Bosh sahifa', view: 'home' as PageView, icon: Home },
    { label: 'Kurslar katalogi', view: 'courses' as PageView, icon: BookOpen },
    { label: 'Professorlar', view: 'professors' as PageView, icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans transition-colors duration-300">
      
      {/* GLOBAL HEADER BAR */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-[#F8FAFC]/90 backdrop-blur-md shadow-premium border-b border-blue-100/60' 
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <div onClick={() => handleNavClick('home')}>
            <Logo />
          </div>

          {/* DESKTOP NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = currentView === item.view || (item.view === 'courses' && currentView === 'course-detail') || (item.view === 'professors' && currentView === 'professor-detail');
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.view)}
                  className={`text-[11px] uppercase tracking-[0.2em] font-semibold transition-all duration-200 relative py-1.5 cursor-pointer ${
                    isActive 
                      ? 'text-blue-600 font-bold' 
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* DESKTOP USER LOGIC */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-white/90 hover:bg-white p-1.5 pr-4 rounded-none transition-all duration-200 border border-blue-100 shadow-sm">
                <div 
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8.5 h-8.5 rounded-none object-cover ring-2 ring-blue-550/10 shadow-sm"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{user.name}</span>
                    <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-widest">Kabinet</span>
                  </div>
                </div>
                
                <div className="w-px h-6 bg-slate-200 mx-1" />
                
                <button 
                  onClick={logout}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors duration-150 cursor-pointer"
                  title="Tizimdan chiqish"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-sky-500 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/15 text-[10px] uppercase font-bold tracking-[0.22em] px-5.5 py-2.5 transition-all duration-300 active:scale-98 cursor-pointer"
              >
                Kirish / Registratsiya
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* MOBILE BURGER BUTTON */}
          <div className="flex items-center gap-3 md:hidden">
            {user && (
              <div 
                onClick={() => handleNavClick('profile')}
                className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-blue-550/10 shadow-sm cursor-pointer"
              >
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE EXPANDED MENU BACKGROUND OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* MOBILE EXTENDED SIDE SHEETS */}
      <div className={`fixed top-20 right-0 w-72 h-[calc(100vh-5rem)] bg-white border-l border-slate-100 shadow-premium z-40 md:hidden transition-all duration-300 ease-in-out transform ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full justify-between p-6">
          <div className="flex flex-col gap-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Navigatsiya</span>
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => {
                const isActive = currentView === item.view;
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.view)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-left transition-all ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 font-bold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-blue-500'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
            {user ? (
              <div className="flex flex-col gap-3">
                <div 
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-lg object-cover ring-2 ring-blue-500/15" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 leading-tight">{user.name}</span>
                    <span className="text-xs text-slate-400">Shaxsiy profil</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Chiqish
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                Profilga kirish
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <div className="text-[10px] text-center text-slate-400 mt-2">
              uStom Education • Barcha huquqlar himoyalangan
            </div>
          </div>
        </div>
      </div>

      {/* CORE FRAME LAYOUT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:py-8 md:pb-12">
        {children}
      </main>

      {/* MOBILE BOTTOM NAVIGATION PANEL */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-blue-100/40 p-2 flex items-center justify-around z-40">
        {menuItems.map((item) => {
          const isActive = currentView === item.view || (item.view === 'courses' && currentView === 'course-detail') || (item.view === 'professors' && currentView === 'professor-detail');
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-blue-600 bg-blue-50/50 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-semibold">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
        <button
          onClick={() => onNavigate(user ? 'profile' : 'auth')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
            currentView === 'profile' || currentView === 'auth' ? 'text-blue-600 bg-blue-50/50 font-bold' : 'text-slate-500'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-semibold">{user ? 'Profil' : 'Kirish'}</span>
        </button>
      </nav>

      {/* PREMIUM HIGH CONTRAST FOOTER */}
      <footer className="bg-[#0B1528] text-blue-100/70 border-t border-blue-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="md:col-span-2 flex flex-col gap-5">
            <Logo dark className="pointer-events-none" />
            <p className="text-sm text-blue-200/60 max-w-md mt-2 leading-relaxed font-light">
              uStom — stomatologlar, ortodontlar va klinika mutaxassislari uchun premium darajadagi malaka oshirish hamda amaliy ko'nikmalar markazi. Biz sohadagi yetakchi amaliyotchilar darslarini jonli fantomlarda va klinika sharoitida o'tamiz.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Kurslar bo'limi</span>
            <div className="flex flex-col gap-3 text-sm font-light">
              <button onClick={() => onNavigate('courses')} className="text-left text-blue-200/65 hover:text-sky-400 transition-colors">Implantologiya</button>
              <button onClick={() => onNavigate('courses')} className="text-left text-blue-200/65 hover:text-sky-400 transition-colors">Ortodontiya & Gnatologiya</button>
              <button onClick={() => onNavigate('courses')} className="text-left text-blue-200/65 hover:text-sky-400 transition-colors">Estetik Stomatologiya</button>
              <button onClick={() => onNavigate('courses')} className="text-left text-blue-200/65 hover:text-sky-400 transition-colors">Mikroskopik Endodontiya</button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Bog'lanish</span>
            <div className="flex flex-col gap-3 text-sm font-light">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 opacity-90" />
                <span>+998 (90) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400 opacity-90" />
                <span>Telegram: @ustom_support</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-sky-400 opacity-90 shrink-0" />
                <span className="leading-tight">Toshkent sh., Navoiy ko'chasi 14, uStom Amaliy Klinikasi</span>
              </div>
            </div>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto border-t border-blue-900/40 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200/40 gap-4">
          <span>&copy; {new Date().getFullYear()} uStom Masterclasses. Barcha huquqlar himoyalangan.</span>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Foydalanish shartlari</span>
            <span className="hover:text-white cursor-pointer">Maxfiylik siyosati</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
