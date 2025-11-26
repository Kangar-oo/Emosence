import React, { useState, useRef, useEffect, useMemo } from 'react';
import Webcam, { WebcamRef } from './components/Webcam';
import ChatMessage from './components/ChatMessage';
import { analyzeEmotionAndChat } from './services/api'; // Using local API
import { Message, HistoryItem, EmotionType } from './types';
import { CRISIS_KEYWORDS, HELPLINE_NUMBER, HELPLINE_TEXT } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', text: "Hello. I am running locally. How are you feeling?", timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [lastDetectedMood, setLastDetectedMood] = useState<EmotionType | null>(null);

  const webcamRef = useRef<WebcamRef>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue;
    
    // Add User Message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);

    // Capture Image
    let imageBase64: string | null = null;
    if (cameraActive && webcamRef.current) {
      imageBase64 = webcamRef.current.getScreenshot();
    }

    // Call Local API
    const result = await analyzeEmotionAndChat(text, imageBase64);

    // Add AI Message
    const modelMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: result.text, timestamp: Date.now() };
    setMessages(prev => [...prev, modelMsg]);
    setLastDetectedMood(result.mood);
    setIsProcessing(false);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans p-6 gap-6">
      {/* Left Panel: Camera & Status */}
      <div className="w-1/3 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-indigo-400">EmoSense Local</h1>
        <div className="aspect-[4/3] w-full rounded-3xl relative">
          <Webcam ref={webcamRef} isActive={cameraActive} />
          {lastDetectedMood && (
             <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-md">
                <span className="text-xs text-slate-400 uppercase">Detected Mood</span>
                <div className="text-xl font-bold text-white">{lastDetectedMood}</div>
             </div>
          )}
        </div>
        <button onClick={() => setCameraActive(!cameraActive)} className="bg-slate-800 p-3 rounded-xl hover:bg-slate-700 transition">
          {cameraActive ? "Disable Camera" : "Enable Camera"}
        </button>
      </div>

      {/* Right Panel: Chat */}
      <div className="w-2/3 flex flex-col bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
          {isProcessing && <div className="text-slate-500 text-sm animate-pulse">Thinking...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-4">
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type here..."
          />
          <button onClick={handleSendMessage} className="bg-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-500">Send</button>
        </div>
      </div>
    </div>
  );
};

export default App;