// ============================================
// COMPONENTE DE COMPARTILHAMENTO - QUEIMA AI
// Menu de compartilhamento para redes sociais
// ============================================
'use client';

import { useState } from 'react';
import { Share2, X, MessageCircle, Instagram, Twitter, Copy, Check } from 'lucide-react';

interface ShareMenuProps {
  title: string;
  description: string;
  onClose: () => void;
}

export default function ShareMenu({ title, description, onClose }: ShareMenuProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `${title}\n\n${description}\n\n🔥 Feito com Queima AI\n👉 queimaai.com`;

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleInstagram = () => {
    navigator.clipboard.writeText(shareText);
    alert('✅ Texto copiado! Cole no Instagram Stories ou Feed!');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Erro ao copiar texto');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md border border-gray-800 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-[#00AEEF]/10 p-2 rounded-lg">
              <Share2 className="w-5 h-5 text-[#00AEEF]" />
            </div>
            <h3 className="text-xl font-bold text-white">Compartilhar</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Options */}
        <div className="p-6 space-y-3">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group"
          >
            <div className="bg-green-500/10 p-3 rounded-lg group-hover:bg-green-500/20 transition-colors">
              <MessageCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">WhatsApp</div>
              <div className="text-sm text-gray-400">Compartilhar no WhatsApp</div>
            </div>
          </button>

          {/* Instagram */}
          <button
            onClick={handleInstagram}
            className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group"
          >
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-3 rounded-lg group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-colors">
              <Instagram className="w-6 h-6 text-pink-500" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Instagram</div>
              <div className="text-sm text-gray-400">Copiar texto para Stories</div>
            </div>
          </button>

          {/* Twitter/X */}
          <button
            onClick={handleTwitter}
            className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group"
          >
            <div className="bg-blue-500/10 p-3 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Twitter className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Twitter / X</div>
              <div className="text-sm text-gray-400">Compartilhar no Twitter</div>
            </div>
          </button>

          {/* Copiar Texto */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group"
          >
            <div className="bg-[#00AEEF]/10 p-3 rounded-lg group-hover:bg-[#00AEEF]/20 transition-colors">
              {copied ? (
                <Check className="w-6 h-6 text-green-500" />
              ) : (
                <Copy className="w-6 h-6 text-[#00AEEF]" />
              )}
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">
                {copied ? 'Copiado!' : 'Copiar Texto'}
              </div>
              <div className="text-sm text-gray-400">
                {copied ? 'Cole onde quiser!' : 'Copiar para área de transferência'}
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <p className="text-center text-sm text-gray-500">
            Compartilhe seus resultados e inspire outras pessoas! 🔥
          </p>
        </div>
      </div>
    </div>
  );
}
