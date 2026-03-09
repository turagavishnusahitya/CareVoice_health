import { useState } from "react";
import { Input } from "@/react-app/components/ui/input";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { ScrollArea } from "@/react-app/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";
import { 
  Search, 
  Plus, 
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter
} from "lucide-react";

type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show";

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
  bookedVia: "voice" | "manual" | "online";
}

const appointments: Appointment[] = [
  {
    id: "1",
    patientName: "Rahul Sharma",
    patientPhone: "+91 98765 43210",
    doctorName: "Dr. Arun Mehta",
    specialty: "Cardiology",
    date: "2024-01-15",
    time: "10:00",
    duration: 30,
    status: "confirmed",
    notes: "Follow-up for heart checkup",
    bookedVia: "voice",
  },
  {
    id: "2",
    patientName: "Priya Patel",
    patientPhone: "+91 87654 32109",
    doctorName: "Dr. Sunita Rao",
    specialty: "Cardiology",
    date: "2024-01-15",
    time: "11:00",
    duration: 45,
    status: "scheduled",
    bookedVia: "online",
  },
  {
    id: "3",
    patientName: "Lakshmi Sundaram",
    patientPhone: "+91 76543 21098",
    doctorName: "Dr. Priya Kapoor",
    specialty: "Dermatology",
    date: "2024-01-16",
    time: "14:00",
    duration: 30,
    status: "scheduled",
    notes: "Skin rash consultation",
    bookedVia: "voice",
  },
  {
    id: "4",
    patientName: "Venkat Reddy",
    patientPhone: "+91 65432 10987",
    doctorName: "Dr. Rajesh Kumar",
    specialty: "General Medicine",
    date: "2024-01-14",
    time: "16:00",
    duration: 20,
    status: "completed",
    bookedVia: "manual",
  },
  {
    id: "5",
    patientName: "Ananya Krishnan",
    patientPhone: "+91 54321 09876",
    doctorName: "Dr. Arun Mehta",
    specialty: "Cardiology",
    date: "2024-01-13",
    time: "09:30",
    duration: 30,
    status: "cancelled",
    notes: "Patient requested cancellation",
    bookedVia: "voice",
  },
  {
    id: "6",
    patientName: "Rahul Sharma",
    patientPhone: "+91 98765 43210",
    doctorName: "Dr. Meena Iyer",
    specialty: "Orthopedics",
    date: "2024-01-17",
    time: "11:30",
    duration: 45,
    status: "scheduled",
    bookedVia: "voice",
  },
];

const statusConfig: Record<AppointmentStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  scheduled: { 
    label: "Scheduled", 
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Clock
  },
  confirmed: { 
    label: "Confirmed", 
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2
  },
  completed: { 
    label: "Completed", 
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    icon: CheckCircle2
  },
  cancelled: { 
    label: "Cancelled", 
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle
  },
  "no-show": { 
    label: "No Show", 
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: AlertCircle
  },
};

const specialtyColors: Record<string, string> = {
  Cardiology: "text-red-600 dark:text-red-400",
  Dermatology: "text-purple-600 dark:text-purple-400",
  "General Medicine": "text-blue-600 dark:text-blue-400",
  Orthopedics: "text-green-600 dark:text-green-400",
};

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const today = new Date().toISOString().split("T")[0];

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;

    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = apt.date === today;
    } else if (dateFilter === "upcoming") {
      matchesDate = apt.date >= today;
    } else if (dateFilter === "past") {
      matchesDate = apt.date < today;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const groupedAppointments = filteredAppointments.reduce((acc, apt) => {
    if (!acc[apt.date]) {
      acc[apt.date] = [];
    }
    acc[apt.date].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              View and manage all doctor appointments
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Appointment
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient, doctor, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard 
            label="Today" 
            value={appointments.filter(a => a.date === today).length} 
            icon={Calendar}
          />
          <StatCard 
            label="Scheduled" 
            value={appointments.filter(a => a.status === "scheduled").length} 
            icon={Clock}
          />
          <StatCard 
            label="Confirmed" 
            value={appointments.filter(a => a.status === "confirmed").length} 
            icon={CheckCircle2}
          />
          <StatCard 
            label="Via Voice" 
            value={appointments.filter(a => a.bookedVia === "voice").length} 
            icon={User}
          />
        </div>

        {/* Appointments List */}
        <ScrollArea className="flex-1">
          <div className="space-y-6">
            {sortedDates.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">
                    {formatDate(date)}
                  </h3>
                  <Badge variant="secondary" className="ml-2">
                    {groupedAppointments[date].length} appointments
                  </Badge>
                </div>

                <div className="space-y-2">
                  {groupedAppointments[date]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((apt) => (
                      <AppointmentCard key={apt.id} appointment={apt} />
                    ))}
                </div>
              </div>
            ))}

            {sortedDates.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No appointments found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Calendar }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const status = statusConfig[appointment.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="text-center min-w-[60px]">
            <p className="text-lg font-bold text-foreground">{appointment.time}</p>
            <p className="text-xs text-muted-foreground">{appointment.duration} min</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{appointment.patientName}</span>
              <span className="text-sm text-muted-foreground">{appointment.patientPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className={`w-4 h-4 ${specialtyColors[appointment.specialty] || "text-muted-foreground"}`} />
              <span className="text-sm text-foreground">{appointment.doctorName}</span>
              <span className="text-sm text-muted-foreground">• {appointment.specialty}</span>
            </div>
            {appointment.notes && (
              <p className="text-sm text-muted-foreground italic">"{appointment.notes}"</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={status.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
          {appointment.bookedVia === "voice" && (
            <span className="text-xs text-primary font-medium">Booked via Voice</span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateStr === today.toISOString().split("T")[0]) {
    return "Today";
  } else if (dateStr === tomorrow.toISOString().split("T")[0]) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
}
