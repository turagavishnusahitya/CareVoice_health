# MediVoice – AI Powered Healthcare Voice Agent

MediVoice is an AI-powered healthcare assistant that enables patients to interact with a voice agent to book, manage, and track doctor appointments. The system supports multilingual conversations and provides a clean interface for managing patients, appointments, medicines, and campaigns.

The goal of MediVoice is to simplify healthcare appointment management through natural voice interaction and intelligent scheduling.

---

## Features

### Voice Agent
- Real-time voice interaction with the AI assistant
- Supports multilingual conversations
- Automatically detects patient language
- Guides patients through appointment booking
- Displays live conversation transcript
- Provides AI-driven responses for scheduling

### Patient Management
- Add and manage patient profiles
- Store phone numbers and language preferences
- Track appointment history
- Search patients by name, phone number, or email

### Appointment Management
- View all scheduled appointments
- Filter and search appointments
- Track appointment status
- Prevent scheduling conflicts
- Display doctor specialization and patient details

### Medicine Management
- Maintain medicine records
- Link medicines with patient prescriptions
- Organize medication information

### Campaign Management
- Run outbound campaigns for patient reminders
- Follow-up communication
- Appointment reminders

---

## System Architecture

The MediVoice platform is designed with the following components:

### Voice Interaction Layer
Handles voice input and output.

- Speech-to-Text (STT)
- Natural Language Processing
- AI reasoning engine
- Text-to-Speech (TTS)

### Application Layer
Provides the core application features.

- Voice Agent conversation interface
- Patient management system
- Appointment scheduling module
- Campaign management

### Database Layer
Stores structured healthcare data.

Main entities include:

- Patients
- Doctors
- Appointments
- Conversation Sessions
- Message History
- Campaign Records

---

## Multilingual Support

MediVoice supports multilingual interaction with patients.

Supported languages:

- English
- Hindi
- Tamil
- Telugu

The voice agent automatically detects the language spoken by the patient and responds accordingly.

---

## Screenshots

### Voice Agent Interface

<img width="1919" height="809" alt="image" src="https://github.com/user-attachments/assets/b436b5c9-cc6c-416c-b74a-a29d97aec226" />


The Voice Agent interface allows users to start a call and interact with the AI assistant. It provides real-time conversation transcripts and intelligent appointment booking assistance.

---

### Patient Management Dashboard
<img width="1919" height="791" alt="image" src="https://github.com/user-attachments/assets/ead54a57-951b-4e9a-897c-c9910419e15b" />



The Patients module allows healthcare administrators to manage patient profiles, language preferences, and appointment records.

---

### Appointment Management

<img width="1919" height="805" alt="image" src="https://github.com/user-attachments/assets/0e8e0dce-3f0a-410c-a6fc-cdb72eb5b31d" />


The Appointments module provides a structured overview of scheduled consultations, patient details, doctor specialization, and appointment status.

---

## Key Functionalities

### Intelligent Appointment Scheduling

The system automatically:

- Checks doctor availability
- Prevents double booking
- Suggests alternative appointment slots
- Maintains appointment status tracking

### Conversation Memory

MediVoice maintains two levels of conversational memory.

**Session Memory**
- Current user intent
- Pending confirmations
- Conversation state

**Cross-Session Memory**
- Patient history
- Language preferences
- Previous appointment interactions

---

---

## How It Works

1. The patient initiates a conversation using the **Voice Agent**.
2. The system converts speech into text using speech recognition.
3. The AI processes the request and understands the user's intent.
4. The system checks doctor availability and appointment schedules.
5. The AI suggests available time slots.
6. Once confirmed, the appointment is booked.
7. The system stores the conversation and appointment data.

---

## Future Improvements

- Integration with hospital management systems
- AI-based symptom triage
- Integration with telemedicine platforms
- Mobile application for patients
- Real-time doctor availability updates

---

## Author

**Turaga Vishnu Sahitya**

Computer Science and Engineering  
Vishnu Institute of Technology

---

## License

This project is intended for academic and research purposes.

## Project Structure
MediVoice
│
├── components
├── pages
├── services
├── database
├── voice-agent
├── screenshots
│ ├── voice-agent.png
│ ├── patients.png
│ └── appointments.png
└── README.md
