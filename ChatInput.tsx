import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  placeholder = "Escribe un mensaje...", 
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-700 bg-slate-800/50 p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-2xl px-4 py-3 text-white placeholder-white/50 resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all min-h-[44px] max-h-[120px]"
            rows={1}
          />
          
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              type="button"
              className="text-white/50 hover:text-white/80 transition-colors"
              disabled={disabled}
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-white/50 hover:text-white/80 transition-colors"
              disabled={disabled}
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput; 