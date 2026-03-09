import { ScrollArea } from "@/react-app/components/ui/scroll-area";
import { User, Bot } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  language?: string;
}

interface TranscriptPanelProps {
  messages: Message[];
  isListening?: boolean;
  interimText?: string;
}

export default function TranscriptPanel({ messages, isListening, interimText }: TranscriptPanelProps) {
  return (
    <div className="flex-1 flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground">Live Transcript</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Real-time conversation display</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && !isListening && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Bot className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Start a call to begin the conversation</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-md"
                    : "bg-muted text-foreground rounded-tl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className={`flex items-center gap-2 mt-2 text-xs ${
                  message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.language && (
                    <>
                      <span>•</span>
                      <span className="uppercase">{message.language}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isListening && (
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="max-w-[75%] bg-primary/10 border border-primary/30 rounded-2xl rounded-tr-md px-4 py-3">
                {interimText ? (
                  <div>
                    <p className="text-sm text-foreground leading-relaxed">{interimText}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-primary font-medium">Listening</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary font-medium">Listening...</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
