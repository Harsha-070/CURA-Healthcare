
# CURA - AI Healthcare Assistant

CURA is a modern, sleek, and intelligent web-based chatbot designed to act as a personal AI healthcare assistant. Built with React, TypeScript, and powered by the Google Gemini API, it provides users with a secure, private, and intuitive platform to ask health-related questions.

The application features a minimalist, professional design with a focus on user experience, including a full authentication system, persistent chat history, and dynamic, content-aware chat naming.

## ✨ Features

- **Secure User Authentication**: Full login and registration system. User data and chat history are stored privately and tied to their account.
- **Persistent, User-Specific Chat Sessions**: All conversations are saved automatically in the browser's local storage, ensuring users can pick up where they left off.
- **Intelligent AI Conversations**: Powered by Google's `gemini-2.5-flash` model, CURA provides empathetic, professional, and knowledgeable answers to health-related questions.
- **Content-Aware Chat Naming**: Just like modern chat applications, new chats are automatically and permanently named based on the topic of the initial conversation (e.g., "Sore Throat & Fever Symptoms").
- **Full Chat Management**:
    - **Archive**: Declutter the main chat list by archiving conversations.
    - **Delete**: Permanently delete individual or multiple chats.
    - **View Archived**: A dedicated view to access and manage archived chats.
- **Comprehensive Settings Panel**:
    - **Account Controls**: Logout or permanently delete your account and all associated data.
    - **Data Controls**: Delete all chats at once or switch to the archived chat view.
    - **Theme Switching**: Seamlessly toggle between a vibrant light mode and a sleek dark mode.
- **Responsive & Modern UI**:
    - A professional, minimalist aesthetic built with Tailwind CSS.
    - Fully responsive design that works beautifully on both desktop and mobile devices.
    - Engaging hover effects and smooth animations for a premium user experience.
- **Helpful Prompt Suggestions**: A "clipboard" of suggested prompts appears at the start of a new chat to help guide the user's conversation.
- **Markdown Support**: The AI's responses correctly render bold text (`**text**`) for better readability and emphasis.
- **Custom Branding**: Features a unique, custom-designed icon and brand identity throughout the application.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI & Backend Logic**: Google Gemini API (`@google/genai`)
- **State Management**: React Hooks (`useState`, `useEffect`, etc.) with the Browser's Local Storage API for data persistence.
- **Styling**: Tailwind CSS for a utility-first styling workflow.
- **Modules & Dependencies**: Browser-based module loading via `esm.sh` (no build step required).
- **Icons**: Custom, reusable SVG components.
- **Utilities**: `uuid` for unique ID generation and `date-fns` for human-readable timestamps.

## 📂 Project Structure

The project is organized into a clean `frontend` and `backend` structure to separate concerns.

```
CURA/
├── backend/
│   └── geminiService.ts   # Handles all communication with the Google Gemini API.
├── frontend/
│   ├── components/        # All reusable React components (Header, ChatWindow, etc.)
│   ├── assets/            # (if any static assets were needed)
│   ├── App.tsx            # Main application component, handles state and logic.
│   ├── index.html         # The main entry point for the browser.
│   ├── index.tsx          # The root React render file.
│   ├── favicon.svg        # The application's browser icon.
│   ├── metadata.json      # Application metadata.
│   └── types.ts           # Shared TypeScript types and interfaces.
└── README.md              # Project documentation (this file).
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Safari).
- An API key from [Google AI Studio](https://aistudio.google.com/).

### Setup

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd CURA
    ```

2.  **Set Up Environment Variable**:
    The application requires a Google Gemini API key to function. This key must be available in the execution environment as a `process.env.API_KEY` variable.

    For local development, you can create a mechanism to load this variable (e.g., using a local development server that supports `.env` files). The service at `backend/geminiService.ts` is hard-coded to look for `process.env.API_KEY`.

    **Important**: Do not hard-code your API key directly into the source code.

3.  **Run the Application**:
    Since this is a static project with no build step, you can run it using any simple local web server. A popular choice is the `serve` package.

    - Install `serve` globally (if you don't have it):
      ```bash
      npm install -g serve
      ```
    - Navigate to the `CURA/frontend` directory and start the server:
      ```bash
      cd frontend
      serve -s
      ```
    - The server will provide a local URL (e.g., `http://localhost:3000`). Open this URL in your browser to use the application.

---

This project was built to demonstrate a full-featured, modern web application using React and the Google Gemini API.
