import React, { useState, useEffect } from 'react';
import { api } from '../lib/api/client';
import { Course, Professor } from '../types';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/Badge';
import { Calendar, MapPin, Users, Award, Shield, CheckCircle, Clock, ChevronRight, User, AlertCircle, ArrowLeft, Loader2, Sparkles, Phone, HelpCircle, GraduationCap } from 'lucide-react';
import { PageView } from '../hooks/useRouter';

interface CourseDetailProps {
  courseId: string;
  onNavigate: (view: PageView, params?: { id?: string }) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ courseId, onNavigate }) => {
  const { user, enrollments, enrollInCourse } = useAuth();
  const [course, setCourse] = useState<(Course & { professor?: Professor }) | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourseDetail = async () => {
      setLoading(true);
      setEnrollError(null);
      try {
        const item = await api.getCourseById(courseId);
        if (item) {
          setCourse(item);
          // Load 2 related courses in the same category or just generic
          const allCourses = await api.getCourses();
          const filtered = allCourses
            .filter(c => c.id !== courseId && (c.category === item.category || c.level === item.level))
            .slice(0, 2);
          setRelatedCourses(filtered.length > 0 ? filtered : allCourses.filter(c => c.id !== courseId).slice(0, 2));
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCourseDetail();
  }, [courseId]);

  if (loading) {
    return (
      <div className="py-24 text-center max-w-sm mx-auto flex flex-col items-center justify-center gap-4 text-[#1C1C1C]">
        <Loader2 className="w-10 h-10 text-[#1C1C1C] animate-spin" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#1C1C1C]/60">Masterklass ma'lumotlari yuklanmoqda...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white border border-[#1C1C1C]/10 rounded-none p-16 text-center max-w-md mx-auto flex flex-col gap-6 items-center">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <h2 className="text-xl font-serif italic text-[#1C1C1C]">Masterklass topilmadi</h2>
        <p className="text-[#1C1C1C]/60 text-xs font-light">
          Siz so'ragan yoki kirmoqchi bo'lgan stomatologiya o'quv kursi bazamizda mavjud emas yoki o'chirilgan bo'lishi mumkin.
        </p>
        <button 
          onClick={() => onNavigate('courses')}
          className="bg-[#1C1C1C] text-white text-[10px] uppercase font-bold tracking-wider px-6 py-3 rounded-none cursor-pointer"
        >
          Katalogga qaytish
        </button>
      </div>
    );
  }

  // Check if current authenticated user is already registered for this class
  const isAlreadyEnrolled = enrollments.some(e => e.courseId === course.id && e.status === 'active');
  const isFull = course.remainingSeats === 0;

  const handleEnroll = async () => {
    if (!user) {
      onNavigate('auth');
      return;
    }

    setEnrolling(true);
    setEnrollError(null);
    try {
      await enrollInCourse(course.id);
      setEnrollSuccess(true);
      // Soft decrement locally of remaining seats for seamless interface logic
      setCourse(prev => prev ? { ...prev, remainingSeats: Math.max(0, prev.remainingSeats - 1) } : null);
    } catch (err: any) {
      setEnrollError(err.message || 'Yozilish jarayonida kutilmagan xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 text-left text-[#1C1C1C]">
      
      {/* 1. TOP BREADCRUMB / GO BACK ACTIONS */}
      <div className="flex items-center justify-between border-b border-[#1C1C1C]/10 pb-4">
        <button 
          onClick={() => onNavigate('courses')}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#1C1C1C]/60 hover:text-[#1C1C1C] cursor-pointer group transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.75" />
          Katalogga qaytish
        </button>
        <div className="text-[10px] font-mono text-[#1C1C1C]/45 uppercase tracking-widest bg-stone-100 p-1.5 px-3 border border-[#1C1C1C]/10">
          ID: {course.id.substring(0, 8)}
        </div>
      </div>

      {/* 2. DYNAMIC INTENDED FEATURE HERO BANNER - MINIMALIST GRACE */}
      <section className="relative h-64 sm:h-80 md:h-96 rounded-none overflow-hidden bg-[#1C1C1C]">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 md:p-10 flex flex-col gap-3 text-white">
          <div className="flex flex-wrap gap-2.5">
            <Badge level={course.level} variant="level" className="rounded-none font-mono" />
            <span className="text-[9.5px] uppercase tracking-widest font-bold bg-white/20 px-2 py-0.5 border border-white/25">
              {course.category}
            </span>
          </div>

          <h1 
            className="text-2xl sm:text-3xl md:text-5xl font-light font-serif tracking-tight leading-tight max-w-4xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {course.title}
          </h1>
        </div>
      </section>

      {/* 3. DUAL GRID SYSTEM: CHAP CONTENTS VS O'NG SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* CHAP CONTENT SECTION (8 columns out of 12) */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* COURSE CONTENT OVERVIEW */}
          <div className="bg-white border border-[#1C1C1C]/10 rounded-none p-6 md:p-8 flex flex-col gap-4">
            <h2 
              className="text-xl font-bold font-serif text-[#1C1C1C]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Masterklass haqida <span className="italic">batafsil</span>
            </h2>
            <p className="text-[#1C1C1C]/80 text-sm font-light leading-relaxed whitespace-pre-line">
              {course.fullDesc}
            </p>
          </div>

          {/* AGENDA TIMELINE LAYOUT */}
          {course.agenda && course.agenda.length > 0 && (
            <div className="bg-white border border-[#1C1C1C]/10 rounded-none p-6 md:p-8 flex flex-col gap-6">
              <h2 
                className="text-xl font-bold font-serif text-[#1C1C1C] flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <Clock className="w-5 h-5 text-[#1C1C1C]/65" />
                Kun tartibi va <span className="italic">o'quv rejasi</span>
              </h2>
              
              <div className="flex flex-col gap-0.5 mt-2 relative pl-6 border-l border-[#1C1C1C]/15">
                {course.agenda.map((item, index) => (
                  <div key={index} className="relative pb-6 last:pb-0">
                    {/* Circle indicators */}
                    <div className="absolute -left-[1.78rem] top-1.5 w-3.5 h-3.5 rounded-none bg-white border border-[#1C1C1C] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#1C1C1C]" />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2.5">
                      <span className="text-[10.5px] font-mono font-bold text-[#1C1C1C] shrink-0 bg-[#FAF9F6] p-1 px-2.5 border border-[#1C1C1C]/10 tracking-widest uppercase">
                        {item.time}
                      </span>
                      <p className="text-sm font-bold text-[#1C1C1C]/90">
                        {item.activity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEACHING PROFESSOR DESCRIPTION CARD */}
          {course.professor && (
            <div className="bg-white border border-[#1C1C1C]/10 rounded-none p-8 flex flex-col gap-6">
              <h2 
                className="text-xl font-bold font-serif text-[#1C1C1C] flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <GraduationCap className="w-5 h-5 text-[#1C1C1C]/65" />
                Dars beruvchi <span className="italic">muallif-ustoz</span>
              </h2>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pt-2">
                <img 
                  src={course.professor.image} 
                  alt={course.professor.name} 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-none object-cover grayscale border border-[#1C1C1C]/10 shrink-0"
                />
                
                <div className="flex flex-col gap-3 text-center md:text-left self-stretch">
                  <div className="flex flex-col gap-0.5">
                    <h3 
                      className="text-lg font-bold text-[#1C1C1C]"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {course.professor.name}
                    </h3>
                    <p className="text-xs font-serif italic text-stone-500 leading-normal">{course.professor.title}</p>
                  </div>
                  
                  <p className="text-[#1C1C1C]/75 text-xs font-light leading-relaxed">
                    {course.professor.bio}
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mt-1">
                    {course.professor.specialties.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="rounded-none font-mono">
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  <button 
                    onClick={() => onNavigate('professor-detail', { id: course.professor?.id })}
                    className="self-center md:self-start inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-[#1C1C1C] hover:underline cursor-pointer pt-2"
                  >
                    Ustozning barcha darslariga o'tish
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* O'NG SIDEBAR SECTION (4 columns out of 12) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* MAIN CHECKLIST SIDEBAR CONTAINER */}
          <div className="bg-white border border-[#1C1C1C]/15 rounded-none p-6 flex flex-col gap-6 sticky top-24">
            
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#1C1C1C]/45 font-bold font-mono">Dars Narxi</span>
              <div className="flex items-baseline justify-center md:justify-start gap-1">
                <span className="text-3xl font-light font-serif text-[#1C1C1C]">{course.price}</span>
                <span className="text-base font-normal font-mono text-[#1C1C1C]/60 uppercase">{course.currency}</span>
              </div>
            </div>

            <div className="border-t border-[#1C1C1C]/10 pt-4 flex flex-col gap-4 text-xs text-[#1C1C1C]/80 font-mono">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#1C1C1C]/60" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-[#1C1C1C]/45 uppercase tracking-widest font-mono">Sana / Muddat</span>
                  <span className="text-[#1C1C1C] text-xs font-semibold">{course.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#1C1C1C]/60" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-[#1C1C1C]/45 uppercase tracking-widest font-mono">Vaqt va davomiyligi</span>
                  <span className="text-[#1C1C1C] text-xs font-semibold">{course.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#1C1C1C]/60 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-[#1C1C1C]/45 uppercase tracking-widest font-mono">O'tkazilish joyi</span>
                  <span className="text-[#1C1C1C] text-xs font-semibold leading-normal">{course.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#1C1C1C]/60" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-[#1C1C1C]/45 uppercase tracking-widest font-mono">O'rinlar soni</span>
                  <span className="text-[#1C1C1C] text-xs font-semibold">
                    Jami: {course.totalSeats} ta / {course.remainingSeats > 0 ? `Qolgan: ${course.remainingSeats} ta` : 'Hamma o\'rinlar to\'lgan'}
                  </span>
                </div>
              </div>
            </div>

            {/* ENROLLMENT SUCCESS BOARD */}
            {enrollSuccess ? (
              <div className="border border-[#1C1C1C] bg-[#FAF9F6] p-5 flex flex-col gap-4">
                <div className="flex gap-2 text-left">
                  <CheckCircle className="w-5 h-5 text-green-700 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-green-800 leading-tight">Muvaffaqiyatli ro'yxatdan o'tildi!</span>
                    <span className="text-[11px] font-light text-stone-600 mt-1 leading-relaxed">
                      Siz darsga onlayn yozildingiz. Shaxsiy profilingizga o'tib barcha yozilgan darslarni ko'rishingiz va dars materiallari bilan tanishishingiz mumkin.
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('profile')}
                  className="w-full bg-[#1C1C1C] text-white py-2.5 font-bold hover:bg-[#1C1C1C]/90 text-[10px] uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1"
                >
                  Shaxsiy kabinetga o'tish
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="border-t border-[#1C1C1C]/10 pt-4 flex flex-col gap-3.5">
                
                {/* Error messages if any */}
                {enrollError && (
                  <div className="bg-red-50 border border-red-200 p-3 flex gap-2 text-xs text-red-650 text-left">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="font-semibold">{enrollError}</span>
                  </div>
                )}

                {/* Main Action Button */}
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || isAlreadyEnrolled || (isFull && !isAlreadyEnrolled)}
                  className={`w-full py-4 text-xs font-bold tracking-[0.2em] transition-all uppercase cursor-pointer rounded-none border ${
                    isAlreadyEnrolled
                      ? 'bg-transparent text-green-700 border-green-300 cursor-not-allowed shadow-none'
                      : isFull
                      ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed shadow-none'
                      : 'bg-[#1C1C1C] text-[white] hover:bg-[#1C1C1C]/90 border-[#1C1C1C]'
                  }`}
                >
                  {enrolling ? (
                    'Yozilish amalga oshmoqda...'
                  ) : isAlreadyEnrolled ? (
                    'Siz ro\'yxatdan o\'tgansiz ✓'
                  ) : isFull ? (
                    'Hamma o\'rinlar to\'lgan'
                  ) : !user ? (
                    'Kirish va Kursga Yozilish'
                  ) : (
                    'Kursga Yozilish'
                  )}
                </button>

                {isAlreadyEnrolled && (
                  <div className="text-[10px] text-stone-600 text-center font-serif italic py-2.5 border-t border-[#1C1C1C]/10">
                    Siz dars ishtirokchisiz! To'lov va dars ishtirok etishi havolasi uchun biz sizga telefon qilamiz.
                  </div>
                )}

                {!isAlreadyEnrolled && !isFull && (
                  <div className="flex items-center justify-center gap-1 text-[9.5px] font-mono text-[#1C1C1C]/45 uppercase tracking-widest mt-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>LITSENZIYALANGAN MARKAziY TA'LIM</span>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* 4. DETAILS - RELATED/OTHER RECOMMENDED MASTERCLASSES */}
      {relatedCourses.length > 0 && (
        <section className="border-t border-[#1C1C1C]/15 pt-12 flex flex-col gap-6.5">
          <h2 
            className="text-2xl font-light font-serif text-[#1C1C1C]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Sizga yoqishi mumkin bo'lgan <span className="italic">darslar</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedCourses.map(rc => (
              <div 
                key={rc.id} 
                onClick={() => onNavigate('course-detail', { id: rc.id })}
                className="group cursor-pointer bg-white border border-[#1C1C1C]/10 p-4 rounded-none flex flex-col sm:flex-row gap-4 hover:border-[#1C1C1C]/25 transition-all duration-300 text-left"
              >
                <div className="w-full sm:w-36 h-24 rounded-none overflow-hidden shrink-0 bg-stone-150 border border-[#1C1C1C]/10">
                  <img src={rc.image} alt={rc.title} className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-500 group-hover:scale-102 group-hover:grayscale-0" />
                </div>
                <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                  <div className="flex flex-col gap-1.5">
                    <h3 
                      className="text-sm font-bold text-[#1C1C1C] line-clamp-1 group-hover:underline transition-colors"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {rc.title}
                    </h3>
                    <p className="text-[11.5px] font-light text-[#1C1C1C]/75 line-clamp-2 leading-snug">
                      {rc.shortDesc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono mt-2 text-[#1C1C1C]/60 pt-2 border-t border-[#1C1C1C]/5">
                    <span>{rc.date}</span>
                    <span className="font-bold font-serif text-[#1C1C1C]">{rc.price} USD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
