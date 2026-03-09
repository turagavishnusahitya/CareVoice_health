import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-card border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </header>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
            <Construction className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground max-w-sm">
            This section is under development and will be available shortly.
          </p>
        </div>
      </div>
    </div>
  );
}

export function PatientsPage() {
  return <PlaceholderPage title="Patients" description="Manage patient records and history" />;
}

export function AppointmentsPage() {
  return <PlaceholderPage title="Doctor Appointments" description="View and manage all appointments" />;
}

export function MedicinesPage() {
  return <PlaceholderPage title="Medicines" description="Medication catalog and prescriptions" />;
}

export function CampaignsPage() {
  return <PlaceholderPage title="Campaigns" description="Outbound call campaigns and tracking" />;
}
