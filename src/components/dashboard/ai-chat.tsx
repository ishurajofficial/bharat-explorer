'use client';

import { useRef, useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, MicOff, ImageIcon, Bot, User, Loader2, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTravelStore } from '@/store/travel-store';

// Global types for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function AIChatbot() {
  const chatLanguage = useTravelStore((state) => state.chatLanguage);
  const setChatLanguage = useTravelStore((state) => state.setChatLanguage);

  const { messages, sendMessage, status } = useChat({
    onError: (error) => {
      console.error('Chat Error:', error);
      alert(`AI Connection Error: ${error?.message || error}\\n\\nPlease ensure you have added a valid GOOGLE_GENERATIVE_AI_API_KEY environment variable in Vercel.`);
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'en-IN'; // Indian English
        
        rec.onresult = (event: any) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInput(transcript);
        };
        
        rec.onend = () => {
          setIsListening(false);
        };
        
        setRecognition(rec);
      }
    }
  }, [setInput]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Please select an image under 5MB.');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }

    const languagePrompt = chatLanguage !== 'English' ? ` (Please respond in ${chatLanguage})` : '';

    if (selectedFile) {
      sendMessage({
        text: (input || 'Analyze this image') + languagePrompt,
        files: fileInputRef.current?.files ? fileInputRef.current.files : undefined
      });
      removeFile();
      setInput('');
    } else {
      sendMessage({ text: input + languagePrompt });
      setInput('');
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 md:bottom-6 right-4 md:right-6 h-14 w-14 rounded-full gradient-saffron shadow-xl z-[60] p-0 flex items-center justify-center hover:shadow-2xl transition-all hover:scale-105 border border-white/20"
      >
        <Bot className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-28 md:bottom-6 right-4 md:right-6 w-[calc(100vw-32px)] md:w-[350px] lg:w-[400px] h-[600px] max-h-[75vh] md:max-h-[85vh] z-[60] flex flex-col shadow-2xl bg-white dark:bg-[#0c0c14] opacity-100 rounded-2xl border border-border/50 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-saffron flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground">Bharat AI Guide</h2>
              <p className="text-xs text-muted-foreground">Ask anything about traveling in India</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={chatLanguage}
              onChange={(e) => setChatLanguage(e.target.value)}
              className="bg-transparent border border-border/50 text-xs rounded-md px-2 py-1 outline-none text-foreground bg-background focus:ring-1 focus:ring-primary"
            >
              <option value="English">English</option>
              <option value="Assamese">Assamese</option>
              <option value="Bengali">Bengali</option>
              <option value="Bhojpuri">Bhojpuri</option>
              <option value="Bodo">Bodo</option>
              <option value="Dogri">Dogri</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Hindi">Hindi</option>
              <option value="Kannada">Kannada</option>
              <option value="Kashmiri">Kashmiri</option>
              <option value="Konkani">Konkani</option>
              <option value="Maithili">Maithili</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Manipuri">Manipuri</option>
              <option value="Marathi">Marathi</option>
              <option value="Nepali">Nepali</option>
              <option value="Odia">Odia</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="Santali">Santali</option>
              <option value="Sindhi">Sindhi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Urdu">Urdu</option>
            </select>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-muted/50 h-8 w-8">
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
            <Bot className="w-16 h-16 text-muted-foreground" />
            <div>
              <p className="font-medium text-lg">How can I help you explore India?</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                Try asking about a state, a monument, or upload a photo to identify it!
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-md">
              <span className="text-xs bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">"Best time to visit Meghalaya?"</span>
              <span className="text-xs bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">"Plan a 3-day trip to Jaipur"</span>
              <span className="text-xs bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">"What is the capital of Sikkim?"</span>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-primary/20 text-primary' : 'gradient-saffron text-white'}`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              m.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                : 'bg-muted/50 border border-border/50 text-foreground rounded-tl-sm'
            }`}>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {m.parts?.map((p, i) => {
                  if (p.type === 'text') {
                    // Strip the hidden language instruction from the user's message in the UI
                    return m.role === 'user' ? p.text.replace(/ \(Please respond in .*\)$/, '') : p.text;
                  }
                  return '';
                }).join('')}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-full gradient-saffron text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-border/50 bg-muted/30">
        {/* File Preview */}
        <AnimatePresence>
          {filePreview && (
            <motion.div 
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="mb-3 relative inline-block"
            >
              <img src={filePreview} alt="Upload preview" className="h-16 w-16 object-cover rounded-lg border border-border" />
              <button 
                onClick={removeFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={onCustomSubmit} className="flex items-end gap-2">
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="flex-shrink-0 rounded-full hover:bg-muted/50 h-10 w-10"
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image"
          >
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </Button>

          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className={`flex-shrink-0 rounded-full h-10 w-10 ${isListening ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600' : 'hover:bg-muted/50 text-muted-foreground'}`}
            onClick={toggleListening}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Mic className="w-5 h-5" />
              </motion.div>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>

          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={isListening ? "Listening..." : "Ask about a place, culture, or upload a photo..."}
            className="flex-1 rounded-full bg-muted/50 border-border/50 h-10 px-4 focus-visible:ring-1"
            disabled={isLoading}
          />

          <Button 
            type="submit" 
            size="icon" 
            className="flex-shrink-0 rounded-full h-10 w-10 gradient-saffron border-0 shadow-sm"
            disabled={(!input.trim() && !selectedFile) || isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
      </motion.div>
    </AnimatePresence>
  );
}
