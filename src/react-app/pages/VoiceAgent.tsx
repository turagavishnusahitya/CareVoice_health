import { useState, useCallback, useRef, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/react-app/components/ui/select";
import { Switch } from "@/react-app/components/ui/switch";
import TranscriptPanel, { Message } from "@/react-app/components/TranscriptPanel";
import SessionStats, { Stats } from "@/react-app/components/SessionStats";
import CallControls from "@/react-app/components/CallControls";
import { useSpeechRecognition } from "@/react-app/hooks/useSpeechRecognition";
import { PhoneIncoming, PhoneOutgoing, Globe, User, AlertCircle } from "lucide-react";

// Stub data for patients
const patients = [
  { id: "1", name: "Rahul Sharma", phone: "+91 98765 43210", language: "hi" },
  { id: "2", name: "Priya Patel", phone: "+91 87654 32109", language: "en" },
  { id: "3", name: "Lakshmi Sundaram", phone: "+91 76543 21098", language: "ta" },
  { id: "4", name: "Venkat Reddy", phone: "+91 65432 10987", language: "te" },
];

const languages = [
  { code: "auto", name: "Auto-Detect", flag: "🌐" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
];

// Language name mapping
const languageNames: Record<string, string> = {
  auto: "Auto",
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
};

export default function VoiceAgent() {
  const [isOutbound, setIsOutbound] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [isCallActive, setIsCallActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    turns: 0,
    toolCalls: 0,
    avgLatency: 0,
    language: "Auto-Detect",
  });
  
  const accumulatedTranscriptRef = useRef("");
  const latencyTimerRef = useRef<number>(0);
  const latenciesRef = useRef<number[]>([]);

  const handleSpeechResult = useCallback((transcript: string, isFinal: boolean) => {
    if (isFinal) {
      accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? " " : "") + transcript.trim();
    }
    setInterimText(isFinal ? "" : transcript);
  }, []);

  const handleSpeechError = useCallback((errorMsg: string) => {
    setError(errorMsg);
    setTimeout(() => setError(null), 5000);
  }, []);

  const handleLanguageDetected = useCallback((language: string) => {
    setStats(prev => ({ ...prev, language }));
  }, []);

  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    language: selectedLanguage,
    onResult: handleSpeechResult,
    onError: handleSpeechError,
    onLanguageDetected: handleLanguageDetected,
  });

  const handleStartCall = useCallback(() => {
    setIsCallActive(true);
    setMessages([]);
    setStats({ turns: 0, toolCalls: 0, avgLatency: 0, language: languageNames[selectedLanguage] || "Auto-Detect" });
    latenciesRef.current = [];
    accumulatedTranscriptRef.current = "";
    resetTranscript();
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "Hello! Welcome to MediVoice. I'm your healthcare assistant. How can I help you today? You can ask me to book, reschedule, or cancel appointments.",
      timestamp: new Date(),
      language: selectedLanguage === "auto" ? "en" : selectedLanguage,
    };
    setMessages([welcomeMessage]);
    setStats(prev => ({ ...prev, turns: 1 }));
    
    // Start listening after a brief delay
    setTimeout(() => {
      latencyTimerRef.current = Date.now();
      startListening();
    }, 500);
  }, [selectedLanguage, resetTranscript, startListening]);

  const handleEndCall = useCallback(() => {
    stopListening();
    setIsCallActive(false);
    setInterimText("");
    accumulatedTranscriptRef.current = "";
  }, [stopListening]);

  const handleInterrupt = useCallback(() => {
    // Stop current speech synthesis if any
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    // Restart listening
    accumulatedTranscriptRef.current = "";
    setInterimText("");
    latencyTimerRef.current = Date.now();
    startListening();
  }, [startListening]);

  const handleDoneListening = useCallback(() => {
    stopListening();
    
    const userText = accumulatedTranscriptRef.current.trim();
    
    if (!userText) {
      // No speech detected, restart listening
      setError("No speech detected. Please try again.");
      setTimeout(() => setError(null), 3000);
      accumulatedTranscriptRef.current = "";
      latencyTimerRef.current = Date.now();
      startListening();
      return;
    }

    // Calculate latency
    const latency = Date.now() - latencyTimerRef.current;
    latenciesRef.current.push(latency);
    const avgLatency = Math.round(
      latenciesRef.current.reduce((a, b) => a + b, 0) / latenciesRef.current.length
    );

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      timestamp: new Date(),
      language: selectedLanguage === "auto" ? "en" : selectedLanguage,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setStats(prev => ({ 
      ...prev, 
      turns: prev.turns + 1,
      avgLatency,
    }));

    // Generate AI response (stub for now - will be replaced with actual AI)
    setTimeout(() => {
      const aiResponse = generateStubResponse(userText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        language: selectedLanguage === "auto" ? "en" : selectedLanguage,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setStats(prev => ({ 
        ...prev, 
        turns: prev.turns + 1,
        toolCalls: prev.toolCalls + 1,
      }));

      // Speak the response using browser TTS
      speakResponse(aiResponse, selectedLanguage);
      
      // Reset and restart listening after response
      accumulatedTranscriptRef.current = "";
      setInterimText("");
      latencyTimerRef.current = Date.now();
      
      // Delay starting to listen until speech is likely done
      const speechDuration = Math.min(aiResponse.length * 50, 5000);
      setTimeout(() => {
        if (isCallActive) {
          startListening();
        }
      }, speechDuration);
    }, 500);
  }, [stopListening, selectedLanguage, startListening, isCallActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  return (
    <div className="h-screen flex flex-col">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Browser Support Warning */}
      {!isSupported && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Speech recognition is not supported in this browser. Please use Chrome or Edge for voice features.</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Voice Agent</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              AI-powered appointment booking assistant
            </p>
          </div>
          
          {/* Call Mode Toggle */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg">
              <div className={`flex items-center gap-2 ${!isOutbound ? "text-primary font-medium" : "text-muted-foreground"}`}>
                <PhoneIncoming className="w-4 h-4" />
                <span className="text-sm">Inbound</span>
              </div>
              <Switch
                checked={isOutbound}
                onCheckedChange={setIsOutbound}
                className="data-[state=checked]:bg-primary"
              />
              <div className={`flex items-center gap-2 ${isOutbound ? "text-primary font-medium" : "text-muted-foreground"}`}>
                <PhoneOutgoing className="w-4 h-4" />
                <span className="text-sm">Outbound</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Transcript Area */}
        <div className="flex-1 p-6 flex flex-col">
          <TranscriptPanel 
            messages={messages} 
            isListening={isListening} 
            interimText={interimText || accumulatedTranscriptRef.current}
          />
        </div>

        {/* Right Sidebar - Controls */}
        <aside className="w-80 border-l border-border bg-muted/30 p-5 flex flex-col gap-5 overflow-auto">
          {/* Patient Selector */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Patient</h3>
            </div>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="flex flex-col">
                      <span>{patient.name}</span>
                      <span className="text-xs text-muted-foreground">{patient.phone}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedPatientData && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">{selectedPatientData.name}</p>
                <p className="text-xs text-muted-foreground">{selectedPatientData.phone}</p>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Language</h3>
            </div>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Call Controls */}
          <CallControls
            isCallActive={isCallActive}
            isListening={isListening}
            onStartCall={handleStartCall}
            onEndCall={handleEndCall}
            onInterrupt={handleInterrupt}
            onDoneListening={handleDoneListening}
          />

          {/* Session Stats */}
          <SessionStats stats={stats} />
        </aside>
      </div>
    </div>
  );
}

// Helper function to generate stub AI responses
function generateStubResponse(userInput: string): string {
  const input = userInput.toLowerCase();
  
  if (input.includes("book") || input.includes("appointment") || input.includes("schedule")) {
    if (input.includes("cardiologist") || input.includes("heart")) {
      return "I can help you book an appointment with a cardiologist. We have Dr. Arun Mehta available tomorrow at 10:00 AM and 2:00 PM, or Dr. Sunita Rao on Friday at 11:00 AM. Which time works best for you?";
    }
    if (input.includes("dermatologist") || input.includes("skin")) {
      return "For dermatology, Dr. Priya Kapoor has availability on Wednesday at 3:00 PM and Thursday at 9:00 AM. Would either of these times work for you?";
    }
    if (input.includes("general") || input.includes("checkup") || input.includes("physician")) {
      return "For a general checkup, Dr. Rajesh Kumar is available today at 4:00 PM or tomorrow morning at 10:30 AM. Which would you prefer?";
    }
    return "I'd be happy to help you book an appointment. What type of doctor are you looking for? We have cardiologists, dermatologists, general physicians, and more.";
  }
  
  if (input.includes("cancel")) {
    return "I can help you cancel an appointment. Could you please confirm which appointment you'd like to cancel? I can see you have an upcoming appointment on Thursday.";
  }
  
  if (input.includes("reschedule") || input.includes("change")) {
    return "I can help you reschedule your appointment. Which appointment would you like to move, and what's your preferred new date and time?";
  }
  
  if (input.includes("tomorrow") || input.includes("10") || input.includes("morning")) {
    return "I've noted your preference for tomorrow morning. Let me confirm: Would you like to book Dr. Arun Mehta at 10:00 AM tomorrow? Please say 'yes' to confirm or 'no' to see other options.";
  }
  
  if (input.includes("yes") || input.includes("confirm") || input.includes("ok") || input.includes("sure")) {
    return "Your appointment has been booked successfully. You'll receive a confirmation message shortly. Thank you for using MediVoice. Is there anything else I can help you with? If not, feel free to end the call. Have a great day!";
  }
  
  if (input.includes("no") || input.includes("other") || input.includes("different")) {
    return "No problem. Let me show you other available options. Dr. Sunita Rao is available on Friday at 11:00 AM, and Dr. Mehta also has a slot on Wednesday at 3:00 PM. Which would you prefer?";
  }
  
  if (input.includes("thank") || input.includes("bye") || input.includes("nothing") || input.includes("that's all")) {
    return "You're welcome! Thank you for using MediVoice. Have a wonderful day, and take care of your health!";
  }
  
  return "I'm here to help you with appointment booking, rescheduling, or cancellations. What would you like to do today?";
}

// Helper function to speak response using browser TTS
function speakResponse(text: string, language: string): void {
  if (!window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language based on selection
  const langMap: Record<string, string> = {
    auto: "en-US",
    en: "en-US",
    hi: "hi-IN",
    ta: "ta-IN",
    te: "te-IN",
  };
  
  utterance.lang = langMap[language] || "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  window.speechSynthesis.speak(utterance);
}
