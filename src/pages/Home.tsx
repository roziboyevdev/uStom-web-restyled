import React, { useState, useEffect } from 'react';
import { api } from '../lib/api/client';
import { Course, Professor } from '../types';
import { Badge } from '../components/ui/Badge';
import { Calendar, MapPin, Users, Award, CheckCircle, GraduationCap, ChevronLeft, ChevronRight, BookOpen, Star, Sparkles, ArrowRight } from 'lucide-react';
import { PageView } from '../hooks/useRouter';

interface HomeProps {
  onNavigate: (view: PageView, params?: { id?: string }) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  // For review/testimonial state
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  const testimonials = [
    {
      name: 'Dr. Shahzod Alimov',
      role: 'Klinik Implantolog',
      content: '"uStom markazida Hikmatilla Qodirovning implantologiya darslarida qatnashdim. Biz faqat maruza eshitmadik, balki haqiqiy qo\'y jag\'larida va fantomlarda sinus-lift operatsiyasini mashq qildik. Ertasigayoq o\'z klinikamda dadil ish boshladim!"',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      rating: 5,
    },
    {
      name: 'Dr. Nigora Yoqubova',
      role: 'Terapevt-Stomatolog',
      content: '"Madina Shodiyeva bilan badiiy restavratsiya darsini uzoq kutilgan edim. Qatlamli kompozit tiklash va mikroskop ostida tish jilolash bo\'yicha barcha savollarimga to\'liq javob oldim. uStom — mutaxassislar uchun haqiqiy xazina."',
      avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=100&auto=format&fit=crop&q=80',
      rating: 5,
    },
    {
      name: 'Dr. Elyorbek Sattorov',
      role: 'Yosh Stomatolog',
      content: '"Akademiyani tamomlab uStomning mikroskop ostida endodontiya intensiv darsiga yozildim. U yerdagi operatsion mikroskoplar, asboblar va sharoit xorijdan qolishmaydi. Tavsiya qilaman!"',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80',
      rating: 5,
    }
  ];

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [loadedCourses, loadedProfessors] = await Promise.all([
          api.getCourses(),
          api.getProfessors(),
        ]);
        // Show first 3 close/upcoming courses
        setCourses(loadedCourses.slice(0, 3));
        setProfessors(loadedProfessors.slice(0, 4));
      } catch (err) {
        console.error('Failed to load home courses:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="flex flex-col gap-16 md:gap-24 text-slate-900">
      
      {/* 1. HERO BANNER - HIGH END EDITORIAL LAYOUT */}
      <section className="relative overflow-hidden bg-transparent border-b border-blue-100 pb-16 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 flex flex-col gap-6 text-left">
            <div className="text-[10px] uppercase tracking-[0.3em] opacity-60 font-bold block text-blue-600">
              Professional Stomatologiya Akademiyasi
            </div>
            
            <h1 
              className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tighter leading-[0.9] text-slate-950"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Zamonaviy<br />
              <span className="italic font-normal text-blue-700">Stomatologiya</span><br />
              Cho'qqilari.
            </h1>
            
            <p className="text-slate-650 text-base md:text-lg max-w-xl font-light leading-relaxed mt-4">
              O'zbekistondagi eng yetakchi professor stomatologlardan jonli darslar, zamonaviy mikroskoplarda va fantom operatsiyalarda chuqurlashtirilgan o'rgatish formatlari.
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              <button 
                onClick={() => onNavigate('courses')}
                className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-sky-550 text-white font-bold px-7 py-3 text-[11px] uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md hover:shadow-lg border-none"
              >
                Kurslarni ko'rish
              </button>
              <button 
                onClick={() => onNavigate('professors')}
                className="bg-transparent hover:bg-blue-50/50 text-blue-750 border border-blue-600/70 font-bold px-7 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors cursor-pointer"
              >
                Ustozlar bilan tanishish
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 relative flex justify-center lg:justify-end">
            <div className="relative w-full aspect-square border border-blue-100 p-2 bg-white shadow-premium">
              <div className="w-full h-full overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80" 
                  alt="uStom Dental training clinic" 
                  className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700"
                />
              </div>
              
              {/* Overlay Editorial Badge */}
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-blue-700 to-blue-900 text-white p-5 flex flex-col gap-1 shadow-md border border-white/10">
                <div className="text-4xl font-light italic font-serif leading-none">
                  10+
                </div>
                <div className="text-[9px] uppercase tracking-widest text-[#FAF9F6]/60 leading-tight">
                  Amaliy <br />dasturlar
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATS SECTION - EDITORIAL PAPER PRINT DIVIDERS */}
      <section className="bg-transparent border-t border-b border-blue-100/60 py-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 lg:divide-x lg:divide-blue-100/65">
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <span className="text-4xl font-light text-blue-600 font-serif mb-1 italic">100%</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Amaliyot kafolati</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 pt-6 sm:pt-2 text-center">
            <span className="text-4xl font-light text-blue-600 font-serif mb-1 italic">20+</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Professor-ustozlar</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 pt-6 lg:pt-2 text-center">
            <span className="text-4xl font-light text-blue-600 font-serif mb-1 italic">1,200+</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Muvaffaqiyatli doringlar</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 pt-6 lg:pt-2 text-center">
            <span className="text-4xl font-light text-blue-600 font-serif mb-1 italic">10</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Fantom ish stoli</span>
          </div>
        </div>
      </section>

      {/* 3. UPCOMING COURSES */}
      <section className="flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b border-blue-100 pb-4">
          <div className="flex flex-col gap-2 text-left">
            <span className="text-[10px] font-bold text-blue-600/80 uppercase tracking-[0.25em]">Yaqinlashayotgan masterklasslar</span>
            <h2 className="text-3xl md:text-4xl font-light font-serif text-slate-900 tracking-tight">
              O'quv dasturlari <span className="italic">katalogi</span>
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('courses')}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all cursor-pointer"
          >
            Barcha darslarni ko'rish
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-blue-50/80 rounded-none h-96 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white border border-blue-100 p-12 text-center text-slate-500 font-serif italic">
            Ayni damda yaqin oradagi kurslar mavjud emas.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => {
              const matchedProf = professors.find(p => p.id === course.professorId);
              const isFull = course.remainingSeats === 0;

              return (
                <div 
                  key={course.id} 
                  className="group bg-white border border-blue-100 overflow-hidden transition-all duration-300 flex flex-col justify-between hover:border-blue-300 hover:shadow-premium"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-50 border-b border-blue-100">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-700 group-hover:scale-102 group-hover:grayscale-0"
                    />
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <Badge level={course.level} variant="level" className="rounded-none font-mono" />
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className={`text-[9.5px] uppercase tracking-wider font-bold px-2 py-0.5 border ${
                        isFull ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {isFull ? 'Joylar yo\'q' : `${course.remainingSeats} bo'sh joy`}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] uppercase tracking-widest font-mono bg-blue-600 text-white px-2.5 py-0.5">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 text-left flex-1 flex flex-col justify-between gap-5">
                    <div className="flex flex-col gap-2">
                      <h3 
                        className="text-base font-bold text-slate-950 group-hover:text-blue-700 group-hover:underline transition-all line-clamp-2 min-h-[3rem] leading-snug"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {course.title}
                      </h3>
                      <p className="text-xs font-light text-slate-650 line-clamp-2 min-h-[2.2rem]">
                        {course.shortDesc}
                      </p>
                    </div>

                    <div className="border-t border-blue-100/60 pt-4 flex flex-col gap-2.5 text-[11.5px] text-slate-600 font-mono">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-500 opacity-80" />
                        <span>{course.date} • {course.time.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 opacity-80 shrink-0" />
                        <span className="truncate">{course.location.split(',')[0]}</span>
                      </div>
                      {matchedProf && (
                        <div className="flex items-center gap-2 mt-1 bg-blue-50/45 p-2 border border-blue-100/70">
                          <img 
                            src={matchedProf.image} 
                            alt={matchedProf.name} 
                            className="w-5.5 h-5.5 rounded-none object-cover grayscale"
                          />
                          <span className="font-bold text-[10.5px] text-slate-700 truncate">{matchedProf.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-blue-100 pt-4 flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kurs narxi</span>
                        <span className="text-base font-semibold font-serif text-slate-900">
                          {course.price} {course.currency}
                        </span>
                      </div>
                      <button 
                        onClick={() => onNavigate('course-detail', { id: course.id })}
                        className="border border-blue-600 bg-transparent hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600 text-blue-600 hover:text-white font-bold text-[10px] uppercase tracking-[0.15em] px-4 py-2 transition-all duration-200 flex items-center gap-1 cursor-pointer"
                      >
                        Batafsil
                        <ArrowRight className="w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. WHY uSTOM SECTION (BENTO STYLE) */}
      <section className="flex flex-col gap-12 border-t border-blue-100 pt-16">
        <div className="text-left max-w-2xl flex flex-col gap-3">
          <span className="text-[10px] font-bold text-blue-600/80 uppercase tracking-[0.3em]">Nega aynan uStom?</span>
          <h2 className="text-3xl md:text-5xl font-light font-serif text-slate-900 tracking-tight">
            Akademik Mukammallik va <span className="italic text-blue-700">Amaliy Sharoit</span>
          </h2>
          <p className="text-slate-650 font-light text-sm max-w-lg mt-1">
            Yillar davomida to'plangan o'quv dasturlari va bemor ustida amaliy mashqlargacha kengaygan mukammal tizim.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white border border-blue-100 rounded-none p-8 text-left flex flex-col gap-4 hover:shadow-premium transition-all duration-300">
            <div className="w-10 h-10 bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-serif text-slate-900">Xalqaro sertifikatlashtirish</h3>
            <p className="text-slate-650 text-xs font-light leading-relaxed">
              Dars o'tgandan so'ng, yetakchi professorlar tomonidan tasdiqlangan va xalqaro hamjamiyatda e'tirof etilgan rasmiy "uStom Masterclass" amaliy ishtirokchi sertifikatiga ega bo'lasiz.
            </p>
          </div>

          <div className="bg-white border border-blue-100 rounded-none p-8 text-left flex flex-col gap-4 hover:shadow-premium transition-all duration-300">
            <div className="w-10 h-10 bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-serif text-slate-900">Jonli fantom-klinika</h3>
            <p className="text-slate-650 text-xs font-light leading-relaxed">
              O'quv xonalari sarg'aygan sun'iy anatomik jag'lar, operatsion stomatologik mikroskoplar va eng yangi fizik materiallar bilan to'la jihozlangan. Siz real xavfsiz sharoitda mashq qilasiz.
            </p>
          </div>

          <div className="bg-white border border-blue-100 rounded-none p-8 text-left flex flex-col gap-4 hover:shadow-premium transition-all duration-300">
            <div className="w-10 h-10 bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-serif text-slate-900">Premium Ustoz-shogird tizimi</h3>
            <p className="text-slate-650 text-xs font-light leading-relaxed">
              Dars yakunlanib ketsa ham, yopiq uStom shifokorlar klubi (Telegram guruhlari va uchrashuvlari) hamda o'zlashtirishdagi murakkab kayslar bo'yicha tezkor maslahat xonasi faoliyat olib boradi.
            </p>
          </div>

        </div>
      </section>

      {/* 5. USER TESTIMONIALS - BEAUTIFUL PAPER BOARD ROW */}
      <section className="bg-white border border-blue-100 rounded-none p-8 md:p-12 text-left relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-[10px] font-bold text-blue-600/80 uppercase tracking-[0.25em]">Shifokorlar munosabati</span>
            <h2 className="text-3xl md:text-4xl font-light font-serif text-slate-900 tracking-tight leading-tight">
              Bitiruvchilarimiz <br />
              hamisha <span className="italic text-blue-700">mamnun</span>
            </h2>
            <p className="text-slate-650 text-xs font-light leading-relaxed max-w-sm">
              uStom kurslarni yuqori salohiyat, samimiylik va chuqur amaliy yo'nalishlar bilan tashkil etishda ilg'or klinika va barcha darajadagi shifokorlarning birinchi tanlovidir.
            </p>
            
            <div className="flex items-center gap-2 mt-4">
              <button 
                onClick={() => setActiveReviewIdx(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                className="w-10 h-10 border border-blue-100 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all cursor-pointer bg-blue-50/40 text-blue-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setActiveReviewIdx(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
                className="w-10 h-10 border border-blue-100 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all cursor-pointer bg-blue-50/40 text-blue-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-blue-50/30 border border-blue-100 p-8 flex flex-col gap-6 relative min-h-[14rem] justify-between">
              
              <div className="absolute top-6 right-6 flex text-blue-500/40 gap-1">
                {[...Array(testimonials[activeReviewIdx].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-blue-600" />
                ))}
              </div>

              <div 
                className="text-slate-800 italic text-base leading-relaxed font-serif pt-4"
              >
                {testimonials[activeReviewIdx].content}
              </div>

              <div className="flex items-center gap-3.5 border-t border-blue-150 pt-4.5 mt-2">
                <img 
                  src={testimonials[activeReviewIdx].avatar} 
                  alt={testimonials[activeReviewIdx].name} 
                  className="w-11 h-11 rounded-none object-cover grayscale border border-blue-100"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">{testimonials[activeReviewIdx].name}</span>
                  <span className="text-[10px] uppercase font-mono text-slate-450 mt-0.5">{testimonials[activeReviewIdx].role}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION CONTAINER - RICH CHARCOAL EDITORIAL ACCENT */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-none p-8 md:p-14 text-center md:text-left shadow-premium border border-blue-950">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-xl">
            <h2 
              className="text-3xl md:text-4xl font-light font-serif text-white leading-tight"
            >
              Klinik ko'nikmalaringizni keyingi bosqichga <span className="italic text-sky-400">ko'taring</span>
            </h2>
            <p className="text-blue-100/70 font-light text-xs md:text-sm">
              Ilovalardagi dars o'rinlari juda qat'iy cheklangan (odatda 12-20 nafar). Navbatingizni yo'qotmaslik uchun onlayn ro'yxatdan o'tish tavsiya qilinadi.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('courses')}
            className="shrink-0 bg-white text-blue-900 hover:bg-blue-50 font-bold px-8 py-4 transition-all text-[11px] uppercase tracking-[0.2em] cursor-pointer shadow-md rounded-none border-none"
          >
            Kurslarni ko'rish va yozilish
          </button>
        </div>
      </section>

    </div>
  );
};
