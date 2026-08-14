import React, { useState, useRef, useEffect } from "react";
import { Zap, Send, Sparkles, Mic, MicOff, ImagePlus, X } from "lucide-react";
import SpaceBackground from "./components/SpaceBackground.jsx";
import ElectricThinking from "./components/ElectricThinking.jsx";
import { saveMessage } from "./lib/supabase.js";

const BACKEND_URL = "https://mahoday-backend-mq9v.onrender.com/chat";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namaste! Main Mahoday hoon — SRIMT ka apna AI assistant. Admission, courses, fees ya placements ke baare mein kuch bhi pooch sakte ho.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  // ---- Voice input (Web Speech API) ----
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

  // ---- Photo upload ----
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

  // ---- Send message ----
  const handleSend = async () => {
    const text = input.trim();
    if ((!text && !imageBase64) || thinking) return;

    const userMsg = { role: "user", content: text, image: imagePreview };
    setMessages((prev) => [...prev, userMsg]);
    saveMessage("user", text || "[image]");

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
      saveMessage("assistant", reply);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Backend abhi connect nahi hai (placeholder URL hai). Gemini API key aur FastAPI backend deploy hote hi ye live jawab dega.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="relative w-full h-screen text-white flex flex-col overflow-hidden font-sans">
      <SpaceBackground />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Zap className="w-5 h-5 text-black" fill="black" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-wide">Mahoday</h1>
          <p className="text-[11px] text-slate-400 -mt-0.5">SR Institute of Management &amp; Technology</p>
        </div>
        <Sparkles className="w-4 h-4 text-indigo-300 ml-auto opacity-60" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
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
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
              <ElectricThinking />
            </div>
          </div>
        )}
      </div>

      {/* Image preview strip */}
      {imagePreview && (
        <div className="relative z-10 px-4 pb-2">
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

      {/* Input */}
      <div className="relative z-10 px-3 py-3 border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-2 py-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white"
          >
            <ImagePlus className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImagePick}
            className="hidden"
          />

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
            className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
