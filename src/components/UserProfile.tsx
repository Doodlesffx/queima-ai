// ============================================
// COMPONENTE DE PERFIL - QUEIMA AI
// Dropdown de perfil no header
// ============================================
'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

interface UserProfileProps {
  userName: string;
  isPro: boolean;
}

export default function UserProfile({ userName, isPro }: UserProfileProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Pega inicial do nome
  const initial = userName.charAt(0).toUpperCase();

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded-full transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0088CC] flex items-center justify-center font-bold text-lg">
          {initial}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0088CC] flex items-center justify-center font-bold text-xl">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{userName}</p>
                <p className="text-xs text-gray-400">
                  {isPro ? (
                    <span className="text-yellow-500">👑 PRO</span>
                  ) : (
                    'Conta Gratuita'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/profile');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left"
            >
              <User className="w-5 h-5 text-[#00AEEF]" />
              <span className="text-white">Meu Perfil</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/profile/edit');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left"
            >
              <Settings className="w-5 h-5 text-[#00AEEF]" />
              <span className="text-white">Editar Dados</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/evolution');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left"
            >
              <svg className="w-5 h-5 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-white">Evolução</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/history');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left"
            >
              <svg className="w-5 h-5 text-[#00AEEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white">Histórico</span>
            </button>

            <div className="border-t border-gray-800 my-2"></div>

            <button
              onClick={async () => {
                setIsOpen(false);
                await supabase.auth.signOut();
                localStorage.clear();
                router.push('/login');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-left"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="text-red-500">Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
