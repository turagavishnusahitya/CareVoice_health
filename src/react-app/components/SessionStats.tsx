import { MessageSquare, Wrench, Clock, Globe } from "lucide-react";

export interface Stats {
  turns: number;
  toolCalls: number;
  avgLatency: number;
  language: string;
}

interface SessionStatsProps {
  stats: Stats;
}

export default function SessionStats({ stats }: SessionStatsProps) {
  const statItems = [
    { icon: MessageSquare, label: "Turns", value: stats.turns.toString() },
    { icon: Wrench, label: "Tool Calls", value: stats.toolCalls.toString() },
    { icon: Clock, label: "Avg Latency", value: `${stats.avgLatency}ms` },
    { icon: Globe, label: "Language", value: stats.language },
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-4">
      <h3 className="font-semibold text-foreground mb-4">Session Stats</h3>
      <div className="grid grid-cols-2 gap-3">
        {statItems.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-muted/50 rounded-lg p-3 flex flex-col gap-1"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </div>
            <span className="text-lg font-semibold text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
