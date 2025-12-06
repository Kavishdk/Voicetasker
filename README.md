# VoiceTasker 🎙️

Welcome to **VoiceTasker**, a smart, voice-enabled task management application. This project was built to demonstrate how modern AI can streamline productivity by allowing users to simply *speak* their tasks instead of typing them out.

With VoiceTasker, you can say *"Remind me to submit the report by next Friday, it's urgent"*, and the application will automatically create a task with the correct title, due date, and priority.

## 🚀 Key Features

-   **🗣️ Voice-to-Task:** Create tasks instantly using natural voice commands.
-   **🤖 Intelligent Parsing:** Powered by **Google Gemini**, the app understands context, relative dates (e.g., "tomorrow"), and priority keywords.
-   **📋 Flexible Views:** Switch between a **Kanban Board** for workflow visualization and a **List View** for quick scanning.
-   **🔍 Smart Filtering:** Easily find tasks by status, priority, due date, or text search.
-   **☁️ Cloud Persistence:** Tasks are securely stored in **MongoDB Atlas**, ensuring your data is safe and accessible.

## 🛠️ Tech Stack

This project is a full-stack application built with:

-   **Frontend:** React (Vite), TypeScript, Tailwind CSS
-   **Backend:** Node.js, Express
-   **Database:** MongoDB Atlas (Cloud)
-   **AI Integration:** Google Gemini API (`@google/genai`)

## 📦 Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites
-   Node.js (v18 or higher)
-   npm
-   A MongoDB Atlas account (or local MongoDB)
-   A Google Gemini API Key

### 1. Clone the repository
```bash
git clone <repository-url>
cd voicetasker
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

**Configure Environment Variables:**
Open `backend/.env` and update the `MONGODB_URI` with your actual connection string:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/voicetasker?retryWrites=true&w=majority
```

Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

**Configure Environment Variables:**
Create a `.env.local` file in the `frontend` directory and add your Gemini API Key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Start the frontend development server:
```bash
npm run dev
```
The application will open at `http://localhost:5173`.

## 📖 API Documentation

The backend exposes a RESTful API at `http://localhost:5000/api`.

| Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Get all tasks | - |
| `POST` | `/tasks` | Create a new task | `{ "title": "Buy milk", "priority": "Medium" }` |
| `PUT` | `/tasks/:id` | Update a task | `{ "status": "Done" }` |
| `DELETE` | `/tasks/:id` | Delete a task | - |

## 🧠 Design Decisions & Assumptions

-   **Database Choice:** I chose **MongoDB Atlas** for the database to provide a robust, cloud-native solution that scales better than local files.
-   **AI Processing:** Voice parsing is handled on the frontend using the Google Gemini API. This reduces latency by sending the audio directly to the AI model without an intermediate backend hop for processing.
-   **Silence Detection:** To improve the user experience, the voice recorder automatically stops after 2 seconds of silence, so users don't have to manually click "Stop".

## 🤖 AI Tools Usage

During development, I utilized AI tools to accelerate the process:
-   **Google Gemini:** Used for the core "Intelligent Parsing" feature to extract structured data from speech.
-   **Coding Assistants:** Used to scaffold the initial React components and generate the Tailwind CSS utility classes, allowing me to focus on the core logic and integration.

---
*Built for SDE Assignment*
