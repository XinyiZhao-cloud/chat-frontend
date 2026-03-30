import React, { useEffect, useState } from "react";
import api from "../api";

export default function ChatPage() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const roomId = 1;

    useEffect(() => {
        loadMessages();
    }, []);

    async function loadMessages() {
        try {
            const res = await api.get(`/api/messages/${roomId}`);
            setMessages(res.data);
        } catch (error) {
            console.error("Load messages failed:", error);
        }
    }

    async function handleSend() {
        if (!messageText.trim()) return;

        try {
            await api.post(`/api/messages/${roomId}`, {
                messageText
            });
            setMessageText("");
            loadMessages();
        } catch (error) {
            console.error("Send message failed:", error);
        }
    }

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Live Chat Application</h1>
            <h2>Chat Page</h2>
            <p>Welcome, {user?.username || "User"}</p>

            <h3>Room: General</h3>

            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    minHeight: "200px",
                    marginBottom: "10px"
                }}
            >
                {messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id || msg.Id} style={{ marginBottom: "8px" }}>
                            <strong>{msg.username || msg.Username}: </strong>
                            <span>{msg.messageText || msg.MessageText}</span>
                        </div>
                    ))
                )}
            </div>

            <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message"
                style={{ width: "70%", padding: "8px", marginRight: "10px" }}
            />
            <button onClick={handleSend} style={{ padding: "8px 16px" }}>
                Send
            </button>
        </div>
    );
}