import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, ImagePlus, X } from "lucide-react";
import SpaceBackground from "./components/SpaceBackground.jsx";
import ElectricThinking from "./components/ElectricThinking.jsx";
import WelcomeScreen from "./components/WelcomeScreen.jsx";
import SidePanel from "./components/SidePanel.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import {
  saveMessage,
  fetchSessionsForUser,
  fetchMessagesBySession,
  getSession,
  clearSession,
} from "./lib/supabase.js";

const BACKEND_URL = "https://mahoday-backend-mq9v.onrender.com/chat";

function newId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [user, setUser] = useState(() => getSession());
  const [authView, setAuthView] = useState("login");

  if (!user) {
    return (
      <div className="relative w-full h-dvh text-white flex items-center justify-center overflow-hidden">
        <SpaceBackground />
        <div className="relative z-10 w-full px-6">
          {authView === "login" ? (
            <Login onAuthed={setUser} onSwitchToSignup={() => setAuthView("signup")} />
          ) : (
            <Signup onAuthed={setUser} onSwitchToLogin={() => setAuthView("login")} />
          )}
        </div>
      </div>
    );
  }

  return (
    <ChatApp
      user={user}
      onLogout={() => {
        clearSession();
        setUser(null);
      }}
    />
  );
}

function ChatApp({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(() => newId());

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported on this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(URL.createObjectURL(file));
      setImageBase64(reader.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openPanel = async () => {
    setPanelOpen(true);
    const list = await fetchSessionsForUser(user.id);
    setSessions(list);
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(newId());
    setPanelOpen(false);
  };

  const handleSelectSession = async (sid) => {
    const history = await fetchMessagesBySession(sid);
    setMessages(history.map((m) => ({ role: m.role, content: m.content })));
    setSessionId(sid);
    setPanelOpen(false);
  };

  const handleSend = async () => {
    const text = input.trim();
    if ((!text && !imageBase64) || thinking) return;

    const userMsg = { role: "user", content: text, image: imagePreview };
    setMessages((prev) => [...prev, userMsg]);
    saveMessage("user", text || "[image]", user.id, sessionId);

    const payload = { message: text, image: imageBase64 };
    setInput("");
    clearImage();
    setThinking(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const reply = data?.reply || "Sorry, abhi jawab nahi mil paya.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      saveMessage("assistant", reply, user.id, sessionId);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Backend se connect nahi ho paya. Thodi der mein try karo." },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const initial = (user?.full_name || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="relative w-full h-dvh text-white flex flex-col font-sans">
      <div className="absolute inset-0">
        <SpaceBackground />
      </div>

      {/* Header - fixed, no logo icon */}
      <div className="relative z-20 flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-sm shrink-0">
        <div>
          <h1 className="text-lg font-semibold tracking-wide">Mahoday</h1>
          <p className="text-[11px] text-slate-400 -mt-0.5">SR Institute of Management &amp; Technology</p>
        </div>
        <button
          onClick={openPanel}
          className="ml-auto w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold"
        >
          {initial}
        </button>
      </div>

      {/* Static heading line */}
      <div className="relative z-10 px-4 py-2 text-center shrink-0">
        <p className="text-sm font-medium text-slate-200">Mahoday - AI Assistant of SRIMT</p>
      </div>

      {/* Messages - scrollable middle section only */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-indigo-600/80 rounded-br-sm"
                    : "bg-white/10 border border-white/10 rounded-bl-sm backdrop-blur-sm"
                }`}
              >
                {m.image && (
                  <img src={m.image} alt="upload" className="rounded-lg mb-2 max-h-40 object-cover" />
                )}
                {m.content}
              </div>
            </div>
          ))
        )}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
              <ElectricThinking />
            </div>
          </div>
        )}
      </div>

      {imagePreview && (
        <div className="relative z-10 px-4 pb-2 shrink-0">
          <div className="relative inline-block">
            <img src={imagePreview} alt="preview" className="h-16 rounded-lg border border-white/20" />
            <button
              onClick={clearImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/80 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input - fixed at bottom, always visible */}
      <div className="relative z-20 px-3 py-3 border-t border-white/10 bg-black/40 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-2 py-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white"
          >
            <ImagePlus className="w-4 h-4" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Apna sawaal likho..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500"
          />

          <button
            onClick={toggleVoice}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              listening ? "bg-red-500/80 text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={handleSend}
            disabled={thinking}
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <SidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        user={user}
        sessions={sessions}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onLogout={onLogout}
      />
    </div>
  );
}
