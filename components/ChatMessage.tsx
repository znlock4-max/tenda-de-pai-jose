import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex w-full mb-6 ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isModel ? 'flex-row' : 'flex-row-reverse'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 ${isModel ? 'border-umbanda-brown' : 'border-umbanda-blue'} shadow-md`}>
          {isModel ? (
            <img src="https://picsum.photos/seed/pretoVelhoIcon/100/100" alt="Pai José" className="w-full h-full object-cover sepia" />
          ) : (
            <div className="w-full h-full bg-umbanda-blue flex items-center justify-center text-white font-bold text-sm">
              VC
            </div>
          )}
        </div>

        {/* Bubble */}
        <div 
          className={`
            p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap
            ${isModel 
              ? 'bg-umbanda-white text-stone-800 rounded-tl-none border border-stone-200' 
              : 'bg-umbanda-light text-stone-900 rounded-tr-none border border-stone-300'
            }
          `}
        >
          {isModel && <p className="text-xs font-bold text-umbanda-brown mb-1 font-serif">Pai José de Angola</p>}
          <div dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }} />
        </div>
      </div>
    </div>
  );
};

// Simple helper to process bolding from markdown style to HTML for display
// In a production app, use 'react-markdown'
const formatMessage = (text: string) => {
  // Bold
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Bullet points
  formatted = formatted.replace(/^- (.*)/gm, '<li class="ml-4 list-disc">$1</li>');
  // Line breaks
  formatted = formatted.replace(/\n/g, '<br />');
  
  return formatted;
};

export default ChatMessage;
