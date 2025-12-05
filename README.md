# VoiceTasker 🎙️

**VoiceTasker** is a smart, voice-enabled task management application designed to streamline your productivity. With built-in AI capabilities, you can simply speak your tasks, and VoiceTasker will automatically categorize, prioritize, and schedule them for you.

Built with **React**, **TypeScript**, **Tailwind CSS**, and **Google Gemini AI**.



## 🚀 Features

-   **🗣️ Voice-to-Task:** Create tasks instantly using voice commands. The AI parses your speech to extract the title, description, priority, and due date.
-   **🤖 AI-Powered Parsing:** Leverages Google's Gemini AI to understand natural language context (e.g., "Remind me to submit the report by next Friday with high priority").
-   **📋 Kanban & List Views:** Switch seamlessly between a Kanban board for workflow visualization and a standard list view.
-   **🔍 Smart Filtering:** Filter tasks by status, priority, due date, or search by text.
-   **📱 Responsive Design:** Fully responsive interface that works great on desktop and mobile devices.
-   **💾 Local Storage:** Your tasks are saved locally in your browser, so you never lose track of your work.

## 🛠️ Tech Stack

-   **Frontend:** React 18, TypeScript, Vite
-   **Styling:** Tailwind CSS
-   **AI Integration:** Google Gemini API (`@google/genai`)
-   **Icons:** Heroicons
-   **Font:** Inter (Google Fonts)

## 📦 Installation & Setup

Follow these steps to run VoiceTasker locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/voicetasker.git
    cd voicetasker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your Google Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```
    > **Note:** You can get a free API key from [Google AI Studio](https://aistudiocdn.com/google-ai-studio).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit `http://localhost:5173` in your browser.

## 📖 Usage Guide

1.  **Creating a Task (Voice):**
    -   Click the **Microphone** button at the bottom right.
    -   Speak your task (e.g., "Buy groceries tomorrow at 5 PM, priority medium").
    -   The AI will fill in the details. Review and click **Create Task**.

2.  **Creating a Task (Manual):**
    -   Click the **New Task** button in the header.
    -   Fill in the details manually and save.

3.  **Managing Tasks:**
    -   Drag and drop tasks between columns in **Board View**.
    -   Click on a task to **Edit** or **Delete** it.
    -   Use the filters at the top to find specific tasks.

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or new features, feel free to open an issue or submit a pull request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ by [Your Name]*
