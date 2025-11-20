// ============================================
// COMPONENTE DE COMPARTILHAMENTO SOCIAL
// Botões para compartilhar resultados
// ============================================
'use client';

import { Share2, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  description: string;
  imageUrl?: string;
}

export default function ShareButtons({ title, description, imageUrl }: ShareButtonsProps) {
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${title}\n\n${description}\n\n`;

  const handleShare = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        // Instagram não permite compartilhamento direto via URL
        // Copiar para clipboard e instruir usuário
        navigator.clipboard.writeText(shareText + shareUrl);
        alert('Texto copiado! Cole nos Stories do Instagram 📸');
        return;
      default:
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
    
    setShowMenu(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Compartilhamento cancelado');
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="w-full bg-[#00AEEF] hover:bg-[#0088CC] text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <Share2 className="w-5 h-5" />
        Compartilhar Resultado
      </button>

      {/* Share Menu (fallback para desktop) */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl z-50">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-2 p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">WhatsApp</span>
              </button>
              
              <button
                onClick={() => handleShare('instagram')}
                className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="text-sm font-semibold">Instagram</span>
              </button>
              
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span className="text-sm font-semibold">Facebook</span>
              </button>
              
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 p-3 bg-black hover:bg-gray-900 rounded-lg transition-colors border border-gray-700"
              >
                <Twitter className="w-5 h-5" />
                <span className="text-sm font-semibold">X (Twitter)</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
