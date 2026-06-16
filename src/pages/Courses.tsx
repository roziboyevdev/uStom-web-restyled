import React, { useState, useEffect } from 'react';
import { api } from '../lib/api/client';
import { Course, CourseLevel, Professor } from '../types';
import { Badge } from '../components/ui/Badge';
import { Search, Calendar, MapPin, Award, Trash, Filter, RefreshCw, Star, HelpCircle } from 'lucide-react';
import { PageView } from '../hooks/useRouter';

interface CoursesProps {
  onNavigate: (view: PageView, params?: { id?: string }) => void;
}

export const Courses: React.FC<CoursesProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [activeLevel, setActiveLevel] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Categories list
  const categories = ['all', 'Implantologiya', 'Ortodontiya', 'Estetik Stomatologiya', 'Endodontiya', 'Biznes va Marketing'];

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {
        search: search || undefined,
        level: activeLevel === 'all' ? undefined : activeLevel,
      };
      
      const [list, profs] = await Promise.all([
        api.getCourses(filters),
        api.getProfessors()
      ]);

      // Category filter (client-side cascade for robustness)
      let filtered = list;
      if (activeCategory !== 'all') {
        filtered = list.filter(c => c.category === activeCategory);
      }

      setCourses(filtered);
      setProfessors(profs);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run on filters alteration (real-time keystroke/tab refresh)
  useEffect(() => {
    loadData();
  }, [search, activeLevel, activeCategory]);

  return (
    <div className="flex flex-col gap-10 text-left text-[#1C1C1C]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2 border-b border-[#1C1C1C]/15 pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#1C1C1C]/60 font-bold">Darslar katalogi</span>
        <h1 
          className="text-4xl md:text-5xl font-light font-serif text-[#1C1C1C] tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Malaka oshirish kurslari <span className="italic">dasturlari</span>
        </h1>
        <p className="text-[#1C1C1C]/75 font-light text-sm max-w-2xl mt-1 leading-relaxed">
          Sohangizdagi so'nggi yangiliklar, materiallar va amaliyotlar bilan tanishing. Qulay vaqt, mutaxassis darajalarini tanlash imkoniyatai bilan bevosita onlayn ro'yxatdan o'tin.
        </p>
      </div>

      {/* FILTER PANEL GRID */}
      <div className="bg-white border border-[#1C1C1C]/10 rounded-none p-6 shadow-premium flex flex-col gap-6">
        
        {/* Search input with prompt response */}
        <div className="relative">
          <Search className="absolute left-4 top-4 text-[#1C1C1C]/40 w-4 h-4" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kurs nomi, mavzu yoki kalit so'z bo'yicha real-vaqtda qidirish..."
            className="w-full bg-[#FAF9F6] border border-[#1C1C1C]/10 text-[#1C1C1C] rounded-none py-3.5 pl-11 pr-4 text-xs font-semibold placeholder-stone-400 focus:outline-none focus:border-[#1C1C1C] transition-all"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-3 text-[10px] uppercase tracking-wider font-bold bg-[#1C1C1C]/10 px-2 py-1 rounded-none hover:bg-[#1C1C1C] hover:text-white text-[#1C1C1C]"
            >
              Tozalash
            </button>
          )}
        </div>

        {/* Level and Category Filters */}
        <div className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-2">
            <span className="text-[9.5px] font-bold text-[#1C1C1C]/50 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Filter className="w-3 h-3" /> DARAXA BO'YICHA / LEVEL
            </span>
            <div className="flex flex-wrap gap-2">
              {['all', CourseLevel.BEGINNER, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED, CourseLevel.EXPERT].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  className={`px-4 py-2 text-[10.5px] uppercase tracking-wider font-bold transition-all cursor-pointer rounded-none border ${
                    activeLevel === lvl 
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]' 
                      : 'bg-white text-[#1C1C1C] border-[#1C1C1C]/10 hover:border-[#1C1C1C]/35'
                  }`}
                >
                  {lvl === 'all' ? 'Barcha darajalar' : lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-[#1C1C1C]/10 pt-4">
            <span className="text-[9.5px] font-bold text-[#1C1C1C]/50 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Award className="w-3 h-3" /> MUTAXASSISLIK / CATEGORY
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[10.5px] uppercase tracking-wider font-bold transition-all cursor-pointer rounded-none border ${
                    activeCategory === cat 
                      ? 'bg-[#1C1C1C] text-[#FAF9F6] border-[#1C1C1C]' 
                      : 'bg-white text-[#1C1C1C]/75 border-[#1C1C1C]/10 hover:border-[#1C1C1C]/35'
                  }`}
                >
                  {cat === 'all' ? 'Barcha yo\'nalishlar' : cat}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* SEARCH AND FILTER COUNT RESULTS */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#1C1C1C]/60 bg-white p-3 px-5 border border-[#1C1C1C]/10">
        <span>NATIJA: <strong className="text-[#1C1C1C] font-bold">{courses.length}</strong> TA MOS KELUVCHI MASTERKLASS</span>
        {(search || activeLevel !== 'all' || activeCategory !== 'all') && (
          <button 
            onClick={() => {
              setSearch('');
              setActiveLevel('all');
              setActiveCategory('all');
            }}
            className="text-[#1C1C1C] hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            Filtrlarni tozalash
          </button>
        )}
      </div>

      {/* COURSES LIST DISPLAY */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-[#1C1C1C]/10 h-96 animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white border border-[#1C1C1C]/10 p-16 text-center max-w-xl mx-auto w-full flex flex-col gap-4 items-center">
          <HelpCircle className="w-10 h-10 text-[#1C1C1C]/30" />
          <h3 className="text-lg font-serif italic text-[#1C1C1C]">So'rovga mos kurslar topilmadi</h3>
          <p className="text-[#1C1C1C]/60 text-xs font-light max-w-sm">
            Iltimos, izlayotgan so'zingizni o'zgartirib ko'ring yoki boshqa professional daraja yoki yo'nalishlarni yuklang.
          </p>
          <button 
            onClick={() => {
              setSearch('');
              setActiveLevel('all');
              setActiveCategory('all');
            }}
            className="bg-[#1C1C1C] text-white px-5 py-2.5 text-[10px] uppercase tracking-wider font-bold rounded-none hover:bg-[#1C1C1C]/90"
          >
            Barchasini ko'rsatish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const matchedProf = professors.find(p => p.id === course.professorId);
            const isFull = course.remainingSeats === 0;

            return (
              <div 
                key={course.id} 
                className="group bg-white border border-[#1C1C1C]/10 overflow-hidden transition-all duration-350 flex flex-col justify-between hover:border-[#1C1C1C]/25"
              >
                <div className="relative h-48 overflow-hidden bg-stone-150 border-b border-[#1C1C1C]/10">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-700 group-hover:scale-102 group-hover:grayscale-0"
                  />
                  
                  {/* Indicators */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <Badge level={course.level} variant="level" className="rounded-none font-mono" />
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`text-[9.5px] uppercase tracking-wider font-bold px-2 py-0.5 border ${
                      isFull ? 'bg-red-50 text-red-700 border-red-200' : 'bg-stone-50 text-stone-800 border-stone-300'
                    }`}>
                      {isFull ? 'Joylar yo\'q' : `${course.remainingSeats} bo'sh joy`}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] uppercase tracking-widest font-mono bg-[#1C1C1C] text-white px-2.5 py-0.5">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 text-left flex-1 flex flex-col justify-between gap-5">
                  <div className="flex flex-col gap-2">
                    <h3 
                      className="text-base font-bold text-[#1C1C1C] group-hover:underline transition-colors line-clamp-2 min-h-[3rem] leading-snug"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {course.title}
                    </h3>
                    <p className="text-xs font-light text-[#1C1C1C]/75 line-clamp-2 min-h-[2.2rem]">
                      {course.shortDesc}
                    </p>
                  </div>

                  {/* Agenda brief preview */}
                  {course.agenda && course.agenda.length > 0 && (
                    <div className="bg-[#FAF9F6] p-3 border border-[#1C1C1C]/10 text-[11px] text-[#1C1C1C]/80 flex flex-col gap-1.5 self-stretch">
                      <span className="font-bold text-[#1C1C1C]/40 text-[9px] uppercase tracking-widest font-mono">Kun tartibi qisqacha</span>
                      <div className="truncate font-serif italic">📌 {course.agenda[0].time} • {course.agenda[0].activity}</div>
                    </div>
                  )}

                  <div className="border-t border-[#1C1C1C]/10 pt-4 flex flex-col gap-2 text-[11.5px] text-[#1C1C1C]/75 font-mono">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 opacity-60" />
                      <span>{course.date} • {course.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 opacity-60 shrink-0" />
                      <span className="truncate">{course.location}</span>
                    </div>
                    {matchedProf && (
                      <div className="flex items-center gap-2 mt-1 bg-[#FAF9F6] p-2 border border-[#1C1C1C]/10">
                        <img 
                          src={matchedProf.image} 
                          alt={matchedProf.name} 
                          className="w-5.5 h-5.5 rounded-none object-cover grayscale"
                        />
                        <div className="flex flex-col leading-none">
                          <span className="font-bold text-[10.5px]">{matchedProf.name}</span>
                          <span className="text-[9px] text-[#1C1C1C]/60 truncate max-w-[12rem] mt-0.5">{matchedProf.title.split(' ')[0]} ...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#1C1C1C]/10 pt-4 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-[#1C1C1C]/45 uppercase tracking-widest">Kurs sarlavha</span>
                      <span className="text-base font-medium font-serif text-[#1C1C1C]">
                        {course.price} {course.currency}
                      </span>
                    </div>
                    <button 
                      onClick={() => onNavigate('course-detail', { id: course.id })}
                      className="border border-[#1C1C1C] bg-transparent hover:bg-[#1C1C1C] text-[#1C1C1C] hover:text-white font-bold text-[10px] uppercase tracking-[0.15em] px-4 py-2.5 transition-colors duration-200 flex items-center gap-1 cursor-pointer"
                    >
                      Dasturni ko'rish
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
