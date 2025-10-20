import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import Avatar from "react-avatar";

export default function ChatWindow({ chatId, darkMode = false }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const API_BASE = "https://aichatbot-production-5ce1.up.railway.app";
  // local if want remove comment
  // useEffect(() => {
  //   const fetchHistory = async () => {
  //     try {
  //       const res = await axios.get(`/api/chats/${chatId}/history`);
  //       setMessages(res.data || []);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchHistory();
  // }, [chatId]);

  useEffect(() => {
  axios
    .get(`${API_BASE}/api/chats/${chatId}/history`)
    .then((res) => setMessages(res.data || []))
    .catch(() => setMessages([]));
}, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { role: "user", content: trimmed, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await axios.post(`${API_BASE}/api/chats/${chatId}/message`, { content: trimmed });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.assistant.content, created_at: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="d-flex flex-column shadow-lg p-3 bg-body-tertiary rounded col-lg-6 col-md-6 col-sm-12" style={{ height: "100vh", overflow: "hidden" }}>
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="d-flex align-items-center justify-content-center p-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", fontWeight: "bold", fontSize: "1.4rem" }}>
            <FaRobot className="me-2 text-warning" size={26} />
            <span className="fw-bold fs-5">AiChat</span>
          </motion.div>

          <div className="flex-grow-1 overflow-auto px-4 py-3 d-flex flex-column" style={{ background: darkMode ? "#222326" : "#fafbfc" }}>
            {messages.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`mb-3 p-3 shadow-sm rounded ${msg.role === "user" ? "bg-primary-subtle text-black ms-auto" : darkMode ? "bg-secondary text-light" : "bg-white text-dark ms-0"}`} style={{ maxWidth: "70%", alignSelf: msg.role === "user" ? "end" : "start" }}>
                <div className="d-flex align-items-center mb-2">
                  <Avatar name={msg.role === "user" ? "You" : "AiChat"} size="28" round className="me-2" />
                  <strong>{msg.role === "user" ? "You" : "AiChat"}</strong>
                  <small className="text-muted ms-2">{dayjs(msg.created_at).format("HH:mm:ss")}</small>
                </div>
                <div>{msg.content}</div>
              </motion.div>
            ))}
            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1 }} className="p-2 mb-2 rounded bg-secondary text-white" style={{ maxWidth: "60%" }}>
                <strong>AiChat</strong>
                <div>Typing...</div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="py-3 px-4 d-flex align-items-center">
            <Avatar name="You" size="32" round className="me-2" />
            <input className="form-control me-2 rounded-pill" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="Type a message..." style={{ background: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000", border: "none", paddingLeft: "25px", paddingBottom: "10px" }} />
            <motion.button onClick={sendMessage} style={{ background: "none", border: "none" }}>
              <MdSend size={30} color="#007bff" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
