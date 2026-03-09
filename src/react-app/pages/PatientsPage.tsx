import { useState } from "react";
import { Input } from "@/react-app/components/ui/input";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { ScrollArea } from "@/react-app/components/ui/scroll-area";
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar, 
  Clock,
  User,
  X,
  Globe
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  language: string;
  dateOfBirth: string;
  lastVisit: string;
  upcomingAppointments: number;
  totalVisits: number;
  status: "active" | "inactive";
}

const patients: Patient[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@email.com",
    language: "Hindi",
    dateOfBirth: "1985-03-15",
    lastVisit: "2024-01-10",
    upcomingAppointments: 1,
    totalVisits: 12,
    status: "active",
  },
  {
    id: "2",
    name: "Priya Patel",
    phone: "+91 87654 32109",
    email: "priya.patel@email.com",
    language: "English",
    dateOfBirth: "1990-07-22",
    lastVisit: "2024-01-08",
    upcomingAppointments: 0,
    totalVisits: 5,
    status: "active",
  },
  {
    id: "3",
    name: "Lakshmi Sundaram",
    phone: "+91 76543 21098",
    email: "lakshmi.s@email.com",
    language: "Tamil",
    dateOfBirth: "1978-11-30",
    lastVisit: "2023-12-20",
    upcomingAppointments: 2,
    totalVisits: 28,
    status: "active",
  },
  {
    id: "4",
    name: "Venkat Reddy",
    phone: "+91 65432 10987",
    email: "venkat.reddy@email.com",
    language: "Telugu",
    dateOfBirth: "1982-05-08",
    lastVisit: "2024-01-05",
    upcomingAppointments: 1,
    totalVisits: 8,
    status: "active",
  },
  {
    id: "5",
    name: "Ananya Krishnan",
    phone: "+91 54321 09876",
    email: "ananya.k@email.com",
    language: "English",
    dateOfBirth: "1995-09-12",
    lastVisit: "2023-11-15",
    upcomingAppointments: 0,
    totalVisits: 3,
    status: "inactive",
  },
];

const languageColors: Record<string, string> = {
  English: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Hindi: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Tamil: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Telugu: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Patients</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage patient records and history
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Patient
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Patient List */}
        <div className="flex-1 flex flex-col border-r border-border">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                    selectedPatient?.id === patient.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.phone}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className={languageColors[patient.language]}>
                        {patient.language}
                      </Badge>
                      {patient.upcomingAppointments > 0 && (
                        <span className="text-xs text-primary font-medium">
                          {patient.upcomingAppointments} upcoming
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-border bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              {filteredPatients.length} of {patients.length} patients
            </p>
          </div>
        </div>

        {/* Patient Details Panel */}
        <aside className="w-96 bg-muted/20 flex flex-col">
          {selectedPatient ? (
            <PatientDetails 
              patient={selectedPatient} 
              onClose={() => setSelectedPatient(null)} 
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Select a patient to view details
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function PatientDetails({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Patient Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{patient.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Badge variant="outline" className={languageColors[patient.language]}>
                {patient.language}
              </Badge>
              <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                {patient.status}
              </Badge>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-card rounded-lg border border-border p-4 space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{patient.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Preferred: {patient.language}</span>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-card rounded-lg border border-border p-4 space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Date of Birth</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="text-sm font-medium text-foreground">{age} years</p>
              </div>
            </div>
          </div>

          {/* Visit Stats */}
          <div className="bg-card rounded-lg border border-border p-4 space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Visit History
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">{patient.totalVisits}</p>
                <p className="text-xs text-muted-foreground">Total Visits</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">{patient.upcomingAppointments}</p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Last visit:</span>
              <span className="text-foreground">
                {new Date(patient.lastVisit).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full gap-2">
              <Calendar className="w-4 h-4" />
              Book Appointment
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Phone className="w-4 h-4" />
              Start Call
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
