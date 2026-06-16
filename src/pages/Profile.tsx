import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api/client';
import { Course } from '../types';
import { Badge } from '../components/ui/Badge';
import { Calendar, MapPin, LogOut, ArrowRight, HelpCircle, Loader2, Award, ShieldAlert, AlertCircle } from 'lucide-react';
import { PageView } from '../hooks/useRouter';

interface ProfileProps {
  onNavigate: (view: PageView, params?: { id?: string }) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { user, enrollments, logout, cancelEnrollment } = useAuth();
  
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    // Redirect unauthenticated guests to security entry gate
    if (!user) {
      onNavigate('auth');
      return;
    }

    const loadEnrolledCourses = async () => {
      setLoadingCourses(true);
      try {
        const list = await api.getCourses();
        // Filter out courses that have active matching enrollment for current user
        const matched = list.filter(c => 
          enrollments.some(e => e.courseId === c.id && e.status === 'active')
        );
        setEnrolledCourses(matched);
      } catch (e) {
        console.error('Failed to load user registered courses:', e);
      } finally {
        setLoadingCourses(false);
      }
    };

    loadEnrolledCourses();
  }, [user, enrollments]);

  if (!user) {
    return null;
  }

  const handleCancelEnrollment = async (courseId: string) => {
    const matchedEnroll = enrollments.find(e => e.courseId === courseId && e.status === 'active');
    if (!matchedEnroll) return;

    if (!window.confirm('Haqiqatdan ham ushbu masterklassda ishtirok etishingizni bekor qilmoqchimisiz?')) {
      return;
    }

    setCancellingId(courseId);
    try {
      await cancelEnrollment(matchedEnroll.id);
      // Soft release item locally matching state change
      setEnrolledCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (e) {
      console.error('Cancel enrollment failed:', e);
      alert('Yozilishni bekor qilishda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-10 text-left text-[#1C1C1C]">
      
      {/* 1. TOP TITLE */}
      <div className="flex flex-col gap-2 border-b border-[#1C1C1C]/15 pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#1C1C1C]/60 font-bold">Shaxsiy profil</span>
        <h1 
          className="text-4xl font-light font-serif text-[#1C1C1C] tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Kabinet va <span className="italic">yozilgan darslar</span>
        </h1>
      </div>

      {/* 2. DENTIST USER ACCOUNT BANNER CARD */}
      <section className="bg-white border border-[#1C1C1C]/10 rounded-none p-6 md:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-none object-cover grayscale border border-[#1C1C1C]/10 shrink-0"
          />
          
          <div className="flex-1 flex flex-col sm:flex-row justify-between gap-6 self-stretch">
            <div className="flex flex-col justify-center gap-1 text-center sm:text-left">
              <div className="flex flex-col gap-0.5">
                <h2 
                  className="text-xl font-bold text-[#1C1C1C]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {user.name}
                </h2>
                <span className="text-[11px] font-mono font-semibold text-stone-500">{user.email}</span>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <Badge variant="primary" className="rounded-none font-mono">Faol ishtirokchi</Badge>
                <Badge variant="secondary" className="rounded-none font-mono">Shifokor-A'zo</Badge>
              </div>
            </div>

            <div className="flex items-center justify-center border-t sm:border-t-0 sm:border-l border-stone-200/60 pt-4 sm:pt-0 sm:pl-8">
              <button 
                onClick={logout}
                className="inline-flex items-center gap-2 border border-[#1C1C1C]/20 hover:bg-stone-50 text-stone-800 font-bold px-5 py-2.5 rounded-none text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Hisobdan chiqish
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE ENROLLED COURSES CONTAINER */}
      <section className="flex flex-col gap-6">
        <h2 
          className="text-2xl font-light font-serif text-[#1C1C1C]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Ishtirok etayotgan dars va <span className="italic">masterklasslaringiz</span>
        </h2>
        
        {loadingCourses ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white border border-[#1C1C1C]/10 rounded-none h-32 animate-pulse" />
            ))}
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="bg-white border border-[#1C1C1C]/10 rounded-none p-16 text-center max-w-lg mx-auto w-full flex flex-col gap-5 items-center">
            <HelpCircle className="w-10 h-10 text-stone-300" />
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-serif italic text-stone-800">Sizda hozircha yozilgan darslar yo'q</h3>
              <p className="text-stone-500 text-xs font-light max-w-sm">
                Markazimiz tomonidan taqdim etilayotgan super hands-on stomatologiya mashg'ulotlarini tanlab, birinchi darsga onlayn yoziling.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('courses')}
              className="bg-[#1C1C1C] text-white text-[10px] lowercase uppercase tracking-widest font-bold px-6 py-3 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              Masterklasslar katalogi
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {enrolledCourses.map((course) => {
              const isCancelling = cancellingId === course.id;
              return (
                <div 
                  key={course.id}
                  className="bg-white border border-[#1C1C1C]/10 p-5 rounded-none flex flex-col justify-between gap-5 transition-all text-left group"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Course miniature image */}
                    <div className="w-full sm:w-32 h-20 rounded-none overflow-hidden shrink-0 bg-stone-150 relative border border-[#1C1C1C]/10">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover grayscale opacity-90" />
                      <div className="absolute top-1 right-1">
                        <Badge variant="success" className="rounded-none font-mono">Faol</Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center min-w-0">
                      <h3 
                        className="text-sm font-bold text-[#1C1C1C] group-hover:underline transition-colors line-clamp-1 leading-snug"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {course.title}
                      </h3>
                      <p className="text-xs font-light text-stone-500 line-clamp-1 mt-0.5">
                        {course.shortDesc}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-2 text-[11px] font-mono text-stone-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 opacity-60" />
                          <span>{course.date}</span>
                        </div>
                        <span className="text-stone-300">|</span>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 opacity-60 shrink-0" />
                          <span className="truncate">{course.location.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational control buttons */}
                  <div className="grid grid-cols-2 gap-3.5 border-t border-stone-105 pt-4">
                    <button
                      onClick={() => onNavigate('course-detail', { id: course.id })}
                      className="bg-stone-50 hover:bg-[#FAF9F6] border border-[#1C1C1C]/10 text-stone-800 font-bold py-2.5 rounded-none text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Batafsil ma'lumot
                    </button>
                    <button
                      onClick={() => handleCancelEnrollment(course.id)}
                      disabled={isCancelling}
                      className="border border-[#1C1C1C]/10 hover:border-red-300 text-red-700 hover:bg-red-50/20 font-bold py-2.5 rounded-none text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isCancelling ? (
                        'O\'chirilmoqda...'
                      ) : (
                        'Bekor qilish'
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. SECURITY INFO BOARD HELPFUL TIPS */}
      <section className="bg-white border border-[#1C1C1C]/10 p-6 rounded-none flex flex-col md:flex-row gap-4 items-start">
        <Award className="w-6 h-6 text-stone-700 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1.5">
          <h3 
            className="text-base font-bold text-[#1C1C1C] leading-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            uStom Shifokorlar Jamiyati Hamkorligi
          </h3>
          <p className="text-stone-500 text-xs font-light leading-relaxed">
            Barcha onlayn ro'yxatdan o'tgan shifokorlarga uStom markazi tomonidan esdalik darslik to'plamlari, har chorakda yopiq dental-vebinarlar va malakaviy savollar platformasiga bepul kirish huquqi topshiriladi. Kelajakdagi darslarda faol ishtirok etishingiz va biron-bir taklifingiz bo'lsa bizning Telegram qo'llab-quvvatlash xizmati bilan hamkorlik qiling.
          </p>
        </div>
      </section>

    </div>
  );
};
