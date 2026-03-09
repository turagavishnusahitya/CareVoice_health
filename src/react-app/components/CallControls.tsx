import { Button } from "@/react-app/components/ui/button";
import { Phone, PhoneOff, Hand, Square, Mic } from "lucide-react";

interface CallControlsProps {
  isCallActive: boolean;
  isListening: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
  onInterrupt: () => void;
  onDoneListening: () => void;
}

export default function CallControls({
  isCallActive,
  isListening,
  onStartCall,
  onEndCall,
  onInterrupt,
  onDoneListening,
}: CallControlsProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <h3 className="font-semibold text-foreground mb-4">Call Controls</h3>
      
      <div className="space-y-3">
        {!isCallActive ? (
          <Button
            onClick={onStartCall}
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium shadow-lg shadow-green-600/20"
          >
            <Phone className="w-5 h-5 mr-2" />
            Start Call
          </Button>
        ) : (
          <>
            <Button
              onClick={onEndCall}
              variant="destructive"
              className="w-full h-12 text-base font-medium shadow-lg shadow-red-600/20"
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              End Call
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onInterrupt}
                variant="outline"
                className="h-11"
              >
                <Hand className="w-4 h-4 mr-2" />
                Interrupt
              </Button>
              
              <Button
                onClick={onDoneListening}
                variant="secondary"
                disabled={!isListening}
                className={`h-11 ${isListening ? "animate-pulse bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
              >
                <Square className="w-4 h-4 mr-2" />
                Done
              </Button>
            </div>
          </>
        )}
      </div>
      
      {isCallActive && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-center gap-3">
            {isListening ? (
              <>
                <div className="relative">
                  <Mic className="w-5 h-5 text-primary" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </div>
                <span className="text-sm font-medium text-primary">Listening... Speak now</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-muted-foreground">Call in progress</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
