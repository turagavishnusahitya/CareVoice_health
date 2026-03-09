import { BrowserRouter as Router, Routes, Route } from "react-router";
import Layout from "@/react-app/components/Layout";
import VoiceAgent from "@/react-app/pages/VoiceAgent";
import PatientsPage from "@/react-app/pages/PatientsPage";
import AppointmentsPage from "@/react-app/pages/AppointmentsPage";
import { 
  MedicinesPage, 
  CampaignsPage 
} from "@/react-app/pages/PlaceholderPages";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<VoiceAgent />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
