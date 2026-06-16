import React, { useState, useEffect } from 'react';
import { api } from '../lib/api/client';
import { Professor, Course } from '../types';
import { Badge } from '../components/ui/Badge';
import { Calendar, MapPin, ArrowLeft, GraduationCap, ChevronRight, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { PageView } from '../hooks/useRouter';

interface ProfessorDetailProps {
  professorId: string;
  onNavigate: (view: PageView, params?: { id?: string }) => void;
}

export const ProfessorDetail: React.FC<ProfessorDetailProps> = ({ professorId, onNavigate }) => {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfessorDetail = async () => {
      setLoading(true);
      try {
        const [prof, profCourses] = await Promise.all([
          api.getProfessorById(professorId),
          api.getCourses({ professorId })
        ]);
        setProfessor(prof);
        setCourses(profCourses);
      } catch (e) {
        console.error('Failed to load professor detail:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfessorDetail();
  }, [professorId]);

  if (loading) {
    return (
      <div className="py-24 text-center max-w-sm mx-auto flex flex-col items-center justify-center gap-4 text-[#1C1C1C]">
        <Loader2 className="w-10 h-10 text-[#1C1C1C] animate-spin" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#1C1C1C]/60">Ma'lumotlar yuklanmoqda...</span>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="bg-white border border-[#1C1C1C]/10 rounded-none p-16 text-center max-w-md mx-auto flex flex-col gap-6 items-center">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <h2 className="text-xl font-serif italic text-[#1C1C1C]">Ekspert topilmadi</h2>
        <p className="text-[#1C1C1C]/60 text-xs font-light">
          Siz so'ragan professor-mutaxassis bizning o'quv markazimiz bazasida topilmadi yoki malakaviy ma'lumotlari yangilanmoqda.
        </p>
        <button 
          onClick={() => onNavigate('professors')}
          className="bg-[#1C1C1C] text-white text-[10px] uppercase font-bold tracking-wider px-6 py-3 rounded-none cursor-pointer"
        >
          Professorlar ro'yxatiga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 text-left text-[#1C1C1C]">
      
      {/* 1. TOP BREADCRUMB TO GO BACK */}
      <div>
        <button 
          onClick={() => onNavigate('professors')}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#1C1C1C]/60 hover:text-[#1C1C1C] cursor-pointer group transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.75" />
          Ustozlar ro'yxatiga qaytish
        </button>
      </div>

      {/* 2. CHRISP PROFESSOR CARD BIO */}
      <section className="bg-white border border-[#1C1C1C]/10 rounded-none p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-10 items-stretch md:items-start">
          
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-none overflow-hidden bg-stone-100 border border-[#1C1C1C]/10 mx-auto shrink-0 relative">
            <img src={professor.image} alt={professor.name} className="w-full h-full object-cover grayscale opacity-90" />
          </div>

          <div className="flex flex-col justify-between flex-1 gap-6 text-center md:text-left self-stretch">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <h1 
                  className="text-3xl sm:text-4xl font-light font-serif text-[#1C1C1C]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {professor.name}
                </h1>
                <p className="text-[10px] font-bold text-[#1C1C1C]/60 tracking-[0.2em] uppercase font-mono">{professor.title}</p>
              </div>

              <div className="w-12 h-px bg-[#1C1C1C]/15 mx-auto md:mx-0 font-light" />

              <p className="text-[#1C1C1C]/85 text-sm font-light leading-relaxed whitespace-pre-line">
                {professor.bio}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#1C1C1C]/10 pt-5 mt-auto gap-4">
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                {professor.specialties.map((spec, i) => (
                  <Badge key={i} variant="secondary" className="rounded-none font-mono">
                    {spec}
                  </Badge>
                ))}
              </div>

              {professor.socials && (
                <div className="flex gap-4 text-xs font-mono text-[#1C1C1C]/50">
                  {professor.socials.instagram && (
                    <a href={professor.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                      Instagram
                    </a>
                  )}
                  {professor.socials.linkedin && (
                    <a href={professor.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                      LinkedIn
                    </a>
                  )}
                  {professor.socials.website && (
                    <a href={professor.socials.website} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 3. COURSES DELIVERED BY CURRENT PROFESSOR */}
      <section className="flex flex-col gap-6">
        <h2 
          className="text-2xl font-light font-serif text-[#1C1C1C]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Muallif boshchiligidagi <span className="italic">amaliy darslar</span>
        </h2>
        
        {courses.length === 0 ? (
          <div className="bg-white border border-[#1C1C1C]/10 rounded-none p-12 text-center text-stone-400 font-serif italic">
            Hozirgi vaqtda professor boshchiligida yaqin orada yangi darslar rejalashtirilmagan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course) => {
              const isFull = course.remainingSeats === 0;
              return (
                <div 
                  key={course.id}
                  className="group bg-white border border-[#1C1C1C]/10 p-5 rounded-none flex flex-col md:flex-row gap-5 hover:border-[#1C1C1C]/30 transition-all duration-300 text-left cursor-pointer"
                  onClick={() => onNavigate('course-detail', { id: course.id })}
                >
                  <div className="w-full md:w-36 h-28 rounded-none overflow-hidden shrink-0 bg-stone-100 relative border border-[#1C1C1C]/10">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover grayscale opacity-90 transition-all duration-500 group-hover:scale-102 group-hover:grayscale-0" />
                    <div className="absolute top-2 left-2">
                      <Badge level={course.level} variant="level" className="rounded-none font-mono" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between flex-1 gap-4 pt-1">
                    <div className="flex flex-col gap-1.5">
                      <h3 
                        className="text-base font-bold text-[#1C1C1C] group-hover:underline transition-colors line-clamp-1 leading-snug"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {course.title}
                      </h3>
                      <p className="text-xs font-light text-[#1C1C1C]/75 line-clamp-2 leading-relaxed">
                        {course.shortDesc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono mt-auto border-t border-[#1C1C1C]/10 pt-3">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-[#1C1C1C]/50 uppercase tracking-widest">Kurs narxi</span>
                        <span className="text-sm font-medium font-serif text-[#1C1C1C]">{course.price} {course.currency}</span>
                      </div>
                      <button className="border border-[#1C1C1C] bg-transparent text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white font-bold text-[9px] uppercase tracking-wider px-3.5 py-1.5 transition-colors duration-200">
                        Batafsil
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
