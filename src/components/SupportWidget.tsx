// ============================================
// WIDGET DE SUPORTE - QUEIMA AI
// Botão flutuante de ajuda com múltiplas opções
// ============================================
'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Mail, Phone, HelpCircle } from 'lucide-react';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // ⚠️ CONFIGURE AQUI:
  const WHATSAPP_NUMBER = '5519983100397'; // SEU NÚMERO (com DDI + DDD)
  const SUPPORT_EMAIL = 'queimaaiapp@gmail.com'; // SEU EMAIL
  const FAQ_URL = '/faq'; // URL da página de FAQ (criar depois)

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Olá! Preciso de ajuda com o Queima AI.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    setIsOpen(false);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Suporte - Queima AI');
    const body = encodeURIComponent('Olá,\n\nPreciso de ajuda com:\n\n');
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setIsOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Olá! Sou ${formData.name} (${formData.email}).\n\n${formData.message}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    setSubmitStatus('success');
    setTimeout(() => {
      setShowForm(false);
      setIsOpen(false);
      setFormData({ name: '', email: '', message: '' });
      setSubmitStatus('idle');
    }, 1500);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => {
            setIsOpen(false);
            setShowForm(false);
          }}
        />
      )}

      {/* Menu de Opções */}
      {isOpen && !showForm && (
        <div className="fixed bottom-24 right-6 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-bold text-white text-lg">Como podemos ajudar?</h3>
            <p className="text-sm text-gray-400 mt-1">Escolha a melhor opção</p>
          </div>

          <div className="p-2">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors text-left group"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <Phone className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">WhatsApp</div>
                <div className="text-sm text-gray-400">Resposta rápida</div>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Email */}
            <button
              onClick={handleEmail}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors text-left group"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Email</div>
                <div className="text-sm text-gray-400">Suporte detalhado</div>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Formulário */}
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors text-left group"
            >
              <div className="w-12 h-12 bg-[#00AEEF]/10 rounded-full flex items-center justify-center group-hover:bg-[#00AEEF]/20 transition-colors">
                <Send className="w-6 h-6 text-[#00AEEF]" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Enviar mensagem</div>
                <div className="text-sm text-gray-400">Formulário rápido</div>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* FAQ */}
            <button
              onClick={() => {
                window.location.href = FAQ_URL;
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors text-left group"
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <HelpCircle className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Central de Ajuda</div>
                <div className="text-sm text-gray-400">Perguntas frequentes</div>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Formulário de Contato */}
      {isOpen && showForm && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white">Envie sua mensagem</h3>
              <p className="text-sm text-gray-400">Responderemos em breve</p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-4 space-y-4">
            {submitStatus === 'success' ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Mensagem enviada!</h4>
                <p className="text-sm text-gray-400">Responderemos em breve.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mensagem</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Como podemos ajudar?"
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00AEEF] transition-colors resize-none"
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                    <p className="text-sm text-red-400">Erro ao enviar. Tente novamente.</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#00AEEF] hover:bg-[#0088CC] text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar pelo WhatsApp
                </button>
              </>
            )}
          </form>
        </div>
      )}

      {/* Botão Flutuante Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-gray-800 rotate-90'
            : 'bg-gradient-to-br from-[#00AEEF] to-[#0088CC] hover:scale-110 animate-pulse-slow'
        }`}
        aria-label="Suporte"
      >
        {isOpen ? (
          <X className="w-6 h-6 mx-auto text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 mx-auto text-white" />
        )}
      </button>

      {/* Badge "Precisa de ajuda?" */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-40 bg-gray-900 border border-gray-800 rounded-full px-4 py-2 shadow-lg animate-bounce-slow">
          <p className="text-sm text-white font-medium whitespace-nowrap">Precisa de ajuda?</p>
        </div>
      )}

      {/* CSS customizado */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 174, 239, 0.7);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(0, 174, 239, 0);
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
