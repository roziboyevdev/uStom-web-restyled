import React, { useState, useEffect } from 'react';
import { api } from '../lib/api/client';
import { Professor } from '../types';
import { Badge } from '../components/ui/Badge';
import { Mail, GraduationCap, ChevronRight, Search, Sparkles, Star } from 'lucide-react';
import { PageView } from '../hooks/useRouter';

interface ProfessorsProps {
  onNavigate: (view: PageView, params?: { id?: string }) => void;
}

export const Professors: React.FC<ProfessorsProps> = ({ onNavigate }) => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProfessors = async () => {
    setLoading(true);
    try {
      const list = await api.getProfessors({ search: search || undefined });
      setProfessors(list);
    } catch (e) {
      console.error('Failed to load professors list:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfessors();
  }, [search]);

  return (
    <div className="flex flex-col gap-10 text-left text-slate-900">
      
      {/* HEADER PORTAL */}
      <div className="flex flex-col gap-2 border-b border-blue-100 pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-blue-600 font-bold">uStom Ustozlari</span>
        <h1 
          className="text-4xl md:text-5xl font-light font-serif text-slate-950 tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Xalqaro darajadagi <span className="italic text-blue-700">professor-mutaxassislarimiz</span>
        </h1>
        <p className="text-slate-650 font-light text-sm max-w-2xl mt-1 leading-relaxed">
          Bizning barcha ma'ruzachilarimiz ko'p yillik amaliy tajribaga va ilmiy darajaga ega bo'lgan yetakchi stomatologlar hamda klinika direktorlaridir.
        </p>
      </div>

      {/* FILTER SEARCH INPUT */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-4 text-slate-450 w-4 h-4" />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ism, ilmiy unvon yoki mutaxassislik bo'yicha qidirish..."
          className="w-full bg-blue-50/20 border border-blue-100 rounded-none py-3.5 pl-11 pr-4 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-all"
        />
      </div>

      {/* PROFESSORS CARD GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-blue-50 h-64 animate-pulse rounded-none" />
          ))}
        </div>
      ) : professors.length === 0 ? (
        <div className="bg-white border border-blue-100 rounded-none p-16 text-center max-w-md mx-auto w-full flex flex-col gap-4 items-center">
          <GraduationCap className="w-10 h-10 text-blue-500/30" />
          <h3 className="text-lg font-serif italic text-slate-800">Ma'ruzachilar topilmadi</h3>
          <p className="text-slate-500 text-xs font-light">
            Siz kiritgan ism yoki so'rov bo'yicha stomatologiya professorlari topilmadi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {professors.map((prof) => (
            <div 
              key={prof.id} 
              className="group bg-white border border-blue-100 rounded-none p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:border-blue-300 hover:shadow-premium transition-all duration-300"
            >
              {/* Image Container */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-none overflow-hidden shrink-0 bg-slate-50 relative mx-auto sm:mx-0 border border-blue-100">
                <img 
                  src={prof.image} 
                  alt={prof.name} 
                  className="w-full h-full object-cover grayscale opacity-90 transition-all duration-500 group-hover:scale-102 group-hover:grayscale-0"
                />
              </div>

              {/* Data Content Box */}
              <div className="flex flex-col justify-between flex-1 gap-4 text-center sm:text-left">
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-col gap-0.5">
                    <h3 
                      className="text-lg font-bold text-slate-950 transition-colors group-hover:text-blue-700"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {prof.name}
                    </h3>
                    <p className="text-xs font-serif italic text-slate-500 leading-relaxed min-h-[2.5rem] line-clamp-2">
                      {prof.title}
                    </p>
                  </div>

                  <p className="text-slate-650 text-xs font-light line-clamp-2 leading-relaxed">
                    {prof.bio}
                  </p>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1 mt-1">
                    {prof.specialties.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="secondary" className="rounded-none font-mono">
                        {spec}
                      </Badge>
                    ))}
                    {prof.specialties.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-bold self-center">+{prof.specialties.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="border-t border-blue-50 pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between mt-auto">
                  <div className="flex gap-2 text-slate-400 text-xs font-mono">
                    {prof.socials?.instagram && (
                      <a 
                        href={prof.socials.instagram} 
                        target="_blank" 
                        rel="noreferrer"
                        className="hover:text-blue-600 transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {prof.socials?.linkedin && (
                      <span className="text-slate-200">|</span>
                    )}
                    {prof.socials?.linkedin && (
                      <a 
                        href={prof.socials.linkedin} 
                        target="_blank" 
                        rel="noreferrer"
                        className="hover:text-blue-600 transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => onNavigate('professor-detail', { id: prof.id })}
                    className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Profil
                    <ChevronRight className="w-3.5 h-3.5 font-bold" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
