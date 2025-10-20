import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [chatId, setChatId] = useState("");

  useEffect(() => {
    let savedId = localStorage.getItem("chatId");
    if (!savedId) {
      savedId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem("chatId", savedId);
    }
    setChatId(savedId);
  }, []);

  if (!chatId) return <div>Loading...</div>;

  return <ChatWindow chatId={chatId} darkMode={false} />;
}
