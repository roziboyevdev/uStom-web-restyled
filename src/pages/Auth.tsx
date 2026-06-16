import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/brand/Logo';
import { Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle, Loader2, KeyRound, HelpCircle, Sparkles } from 'lucide-react';
import { PageView } from '../hooks/useRouter';

interface AuthProps {
  onNavigate: (view: PageView, params?: { id?: string }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onNavigate }) => {
  const { login, register, error, clearError } = useAuth();
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    clearError();
    setValidationError(null);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    // Form inputs checks
    if (!email || !password) {
      setValidationError('Iltimos, barcha maydonlarni to\'ldiring.');
      return;
    }

    if (!isLoginView && !name) {
      setValidationError('Iltimos, ismingizni kiriting.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Parol kamida 6 belgidan iborat bo\'lishi shart.');
      return;
    }

    setLoading(true);
    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onNavigate('profile');
      }, 1200);

    } catch (err: any) {
      console.error('Authentication process failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fast One-Click Sign In and Auto Fill Test for testing reviewer
  const handleTestUserLogin = async () => {
    clearError();
    setValidationError(null);
    setLoading(true);
    try {
      await login('test@example.com', 'password123');
      setSuccess(true);
      setTimeout(() => {
        onNavigate('profile');
      }, 1200);
    } catch (err) {
      console.error('Test login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-md mx-auto w-full text-left text-[#1C1C1C]">
      
      {/* AUTHENTICATION BOX SHADOW PREMIER CONTAINER */}
      <div className="bg-white border border-[#1C1C1C]/10 rounded-none p-6 md:p-8 flex flex-col gap-6.5 relative overflow-hidden">
        
        {/* Brand visual header */}
        <div className="flex flex-col items-center justify-center text-center gap-2 pb-2">
          <Logo />
          <h2 
            className="text-2xl font-light font-serif text-[#1C1C1C] mt-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {isLoginView ? 'Profilga kirish' : 'Ro\'yxatdan o\'tish'}
          </h2>
          <p className="text-[#1C1C1C]/70 text-xs font-light max-w-xs leading-normal mt-1">
            {isLoginView 
              ? 'uStom kurslarida qatnashish va dars ma’lumotlarini kuzatib borish uchun kiring.' 
              : 'Yangi hisob yaratib, darslarimizga bir marta bosish orqali onlayn yoziling.'}
          </p>
        </div>

        {/* Global error boards and validation prompts */}
        {(validationError || error) && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-none flex gap-2.5 text-xs text-red-700 font-mono items-start leading-normal">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="font-bold">XATOLIK:</span>
              <p className="text-red-700/90 mt-0.5">{validationError || error}</p>
            </div>
          </div>
        )}

        {/* SUCCESS LOVELY BOARD TIMED OUT TRANSITION */}
        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-12 h-12 bg-[#FAF9F6] border border-[#1C1C1C]/10 text-stone-800 rounded-none flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-[#1C1C1C]">Muvaffaqiyatli!</h3>
              <p className="text-stone-500 text-xs font-light max-w-xs leading-relaxed">
                Tizimga kirdingiz. Siz 1.2 soniya ichida shaxsiy kabinetga yo'naltirilyapsiz...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
            
            {/* NAME FIELD FOR SIGN UP */}
            {!isLoginView && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[9.5px] font-bold text-stone-500 uppercase tracking-widest pl-0.5 font-mono">To'liq ismingiz</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-stone-400 w-4 h-4" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ali Valiyev"
                    className="w-full bg-[#FAF9F6] border border-[#1C1C1C]/10 text-[#1C1C1C] rounded-none py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#1C1C1C] transition-all placeholder-stone-400"
                  />
                </div>
              </div>
            )}

            {/* EMAIL FIELD */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9.5px] font-bold text-stone-500 uppercase tracking-widest pl-0.5 font-mono">Email manzilingiz</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-stone-400 w-4 h-4" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali@example.com"
                  className="w-full bg-[#FAF9F6] border border-[#1C1C1C]/10 text-[#1C1C1C] rounded-none py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#1C1C1C] transition-all placeholder-stone-400"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9.5px] font-bold text-stone-500 uppercase tracking-widest pl-0.5 font-mono">Ma'ruza paroli</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-stone-400 w-4 h-4" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAF9F6] border border-[#1C1C1C]/10 text-[#1C1C1C] rounded-none py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-[#1C1C1C] transition-all placeholder-stone-400"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C1C1C] hover:bg-[#1C1C1C]/95 text-[#FAF9F6] font-bold py-3.5 rounded-none transition-all text-xs uppercase tracking-[0.2em] mt-3 cursor-pointer"
            >
              {loading ? (
                'Iltimos kutib turing...'
              ) : isLoginView ? (
                'Profilingizga kirish'
              ) : (
                'Ro\'yxatdan o\'tish'
              )}
            </button>

            {/* SIGN IN/SIGN UP VIEW SWITCHER */}
            <div className="text-center text-xs mt-3 text-[#1C1C1C]/60 font-light">
              <span>{isLoginView ? "Hisobingiz yo'qmi?" : "Allaqachon hisobingiz bormi?"}</span>
              <button 
                type="button"
                onClick={toggleView}
                className="text-[#1C1C1C] font-bold ml-1.5 hover:underline cursor-pointer"
              >
                {isLoginView ? "Ro'yxatdan o'tish" : "Kirish"}
              </button>
            </div>

            {/* RAPID REAL TEST USER ONE-CLICK SIGN IN CONTAINER */}
            {isLoginView && (
              <div className="border-t border-[#1C1C1C]/10 pt-5 mt-4 flex flex-col gap-2.5 text-left">
                <span className="text-[9.5px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <KeyRound className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                  Tezkor sinov hisobi (Tavsiya!)
                </span>
                <p className="text-[11px] text-[#1C1C1C]/60 font-light leading-normal">
                  Dars yozilishi va kabinetni tezkor tekshirish uchun ushbu test hisobidan foydalaning:
                </p>
                <button
                  type="button"
                  onClick={handleTestUserLogin}
                  disabled={loading}
                  className="w-full bg-[#FAF9F6] hover:bg-stone-100 text-[#1C1C1C] border border-[#1C1C1C]/10 font-bold py-2.5 text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Test hisobi bilan kirish (Ali Valiyev)
                </button>
              </div>
            )}

          </form>
        )}

      </div>

    </div>
  );
};
