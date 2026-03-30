import React, { useEffect, useState, useRef } from "react";
import api from "../api";

export default function ChatPage() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const bottomRef = useRef(null);
    const roomId = 1;

    useEffect(() => {
        loadMessages();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function loadMessages() {
        try {
            const res = await api.get(`/api/messages/${roomId}`);
            setMessages(res.data);
        } catch (error) {
            console.error(error);
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
            console.error(error);
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>💬 Live Chat</h2>
                <span>Welcome, {user?.username}</span>
            </div>

            <div style={styles.chatBox}>
                {messages.length === 0 ? (
                    <p style={{ color: "#888" }}>No messages yet</p>
                ) : (
                    messages.map((msg) => {
                        const isMe =
                            (msg.username || msg.Username) === user?.username;

                        return (
                            <div
                                key={msg.id || msg.Id}
                                style={{
                                    ...styles.message,
                                    alignSelf: isMe
                                        ? "flex-end"
                                        : "flex-start",
                                    backgroundColor: isMe
                                        ? "#4CAF50"
                                        : "#e5e5ea",
                                    color: isMe ? "white" : "black"
                                }}
                            >
                                {!isMe && (
                                    <div style={styles.username}>
                                        {msg.username || msg.Username}
                                    </div>
                                )}
                                <div>
                                    {msg.messageText || msg.MessageText}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            <div style={styles.inputArea}>
                <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    style={styles.input}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend} style={styles.button}>
                    Send
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "600px",
        margin: "40px auto",
        border: "1px solid #ddd",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        fontFamily: "Arial"
    },
    header: {
        padding: "15px",
        borderBottom: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    chatBox: {
        flex: 1,
        padding: "15px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        background: "#fafafa"
    },
    message: {
        padding: "10px 14px",
        borderRadius: "16px",
        maxWidth: "70%",
        wordBreak: "break-word"
    },
    username: {
        fontSize: "12px",
        opacity: 0.7,
        marginBottom: "4px"
    },
    inputArea: {
        display: "flex",
        padding: "10px",
        borderTop: "1px solid #eee",
        gap: "10px"
    },
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc"
    },
    button: {
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#4CAF50",
        color: "white",
        cursor: "pointer"
    }
};