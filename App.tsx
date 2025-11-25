import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import { sendMessageToPaiJose, initializeAI, generateAudioResponse } from './services/geminiService';
import { Message } from './types';

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// Helper to decode Base64 to Uint8Array
const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Helper to convert raw PCM (Int16) to AudioBuffer
const pcmToAudioBuffer = (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): AudioBuffer => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

const App: React.FC = () => {
  // State logic
  const [messages, setMessages] = useState<Message[]>([]); // Keeps history for logic
  const [lastUserText, setLastUserText] = useState<string>(''); // To show subtitles of user
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Controls Pai Jose animation
  const [isListening, setIsListening] = useState(false); // Controls Mic state
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize
  useEffect(() => {
    initializeAI();
    
    // Setup Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleUserVoiceInput(transcript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error("Erro no reconhecimento de fala:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
           alert("Zifio, você precisa permitir o microfone para que o velho possa te ouvir. Verifique as permissões do seu navegador.");
        }
      };
    }

    // Initial silent greeting just to populate state/context if needed, 
    // or we can just wait for user interaction. 
    // Let's add an initial message to history but NOT play it automatically to avoid autoplay policies.
    const initialMessage: Message = {
      id: 'init-1',
      role: 'model',
      text: 'Saravá. Estou aqui no cruzeiro.',
      timestamp: new Date()
    };
    setMessages([initialMessage]);

  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isProcessing && !isSpeaking) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Erro ao iniciar escuta:", e);
      }
    } else if (!recognitionRef.current) {
      alert("Seu navegador não suporta reconhecimento de voz, meu filho.");
    }
  };

  const playAudio = async (base64Audio: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const pcmBytes = decode(base64Audio);
      const audioBuffer = pcmToAudioBuffer(pcmBytes, ctx);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
      };

      setIsSpeaking(true);
      source.start();
    } catch (error) {
      console.error("Erro ao reproduzir áudio:", error);
      setIsSpeaking(false);
    }
  };

  const handleUserVoiceInput = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    setLastUserText(text);

    // Add user message to history
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsProcessing(true);

    try {
      // 1. Get Text Response (Gemini maintains history via chatSession inside service)
      const responseText = await sendMessageToPaiJose(text);
      
      // Add model message to history (internal only)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      // 2. Get Audio Response
      const cleanText = responseText.replace(/\*/g, ''); // Remove markdown for cleaner TTS processing if needed
      const audioBase64 = await generateAudioResponse(cleanText);
      
      if (audioBase64) {
        await playAudio(audioBase64);
      }

    } catch (error) {
      console.error("Failed to process conversation", error);
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-sans text-stone-200">
      
      {/* Background Image: Cruzeiro das Almas / Cemetery Night Atmosphere */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1518047913075-c53322fb7ba7?q=80&w=1920&auto=format&fit=crop')",
          filter: "grayscale(60%) contrast(120%)" 
        }}
      />
      
      {/* Overlay Gradient for focus */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

      {/* Sidebar (Hidden by default, accessible via button) */}
      <div className="absolute top-0 left-0 z-30 h-full">
         <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-between h-full w-full p-6">
        
        {/* Header / Top Controls */}
        <header className="w-full flex justify-between items-start">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="p-2 text-white/50 hover:text-white transition-colors"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
             </svg>
           </button>
           
           <div className="text-center opacity-80">
             <h1 className="font-serif text-xl tracking-widest text-stone-300">CRUZEIRO DAS ALMAS</h1>
             <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Tenda de Pai José</p>
           </div>

           <div className="w-8"></div> {/* Spacer */}
        </header>

        {/* Central Avatar - Pai José */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg">
           
           <div className="relative group cursor-pointer" onClick={() => !isSpeaking && !isListening && !isProcessing && startListening()}>
             {/* Glow Effect when speaking */}
             <div 
                className={`absolute inset-0 rounded-full bg-white/20 blur-3xl transition-opacity duration-500 ${isSpeaking ? 'opacity-100 animate-pulse' : 'opacity-0'}`}
             ></div>

             {/* Image Container */}
             <div 
               className={`
                 relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-stone-600 shadow-2xl transition-transform duration-700
                 ${isSpeaking ? 'scale-105 border-stone-400' : 'scale-100 grayscale-[30%]'}
                 ${isProcessing ? 'animate-bounce' : ''}
               `}
             >
                <img 
                  src="https://images.unsplash.com/photo-1559892591-1372332a9a4b?q=80&w=1000&auto=format&fit=crop" 
                  alt="Preto Velho" 
                  className="w-full h-full object-cover"
                />
                {/* Overlay to darken image slightly for atmosphere */}
                <div className="absolute inset-0 bg-amber-900/20 mix-blend-overlay"></div>
             </div>

             {/* Status Text under avatar */}
             <div className="mt-6 text-center h-8">
                {isListening && <p className="text-amber-400 font-serif animate-pulse">Ouvindo...</p>}
                {isProcessing && <p className="text-stone-400 font-serif italic">Pitando o cachimbo...</p>}
                {isSpeaking && <p className="text-white font-serif tracking-wide">Pai José falando...</p>}
                {!isListening && !isProcessing && !isSpeaking && <p className="text-stone-500 text-sm">Toque no microfone para pedir a bênção</p>}
             </div>
           </div>

        </div>

        {/* Bottom Area: Subtitles & Mic Control */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-6 mb-8">
          
          {/* User Subtitles (Last thing user said) */}
          <div className={`text-center transition-opacity duration-500 ${lastUserText ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-stone-400 text-sm md:text-lg font-light italic">
              "{lastUserText}"
            </p>
          </div>

          {/* Microphone Button */}
          <button
            onClick={startListening}
            disabled={isListening || isProcessing || isSpeaking}
            className={`
              relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl
              ${isListening 
                ? 'bg-red-600 scale-110 ring-4 ring-red-900/50' 
                : isProcessing 
                  ? 'bg-stone-700 cursor-wait opacity-50'
                  : 'bg-stone-800 hover:bg-stone-700 border border-stone-600 hover:scale-105'
              }
            `}
          >
            {isListening ? (
              <div className="w-8 h-8 bg-white rounded-sm animate-pulse" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-stone-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
          
          <p className="text-[10px] text-stone-600 uppercase tracking-widest">
            {isListening ? "Fale sua dúvida..." : "Segure o terço e pergunte"}
          </p>
        </div>

      </main>
    </div>
  );
};

export default App;