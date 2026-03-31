import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../api";

const SOCKET_ENDPOINT = "https://YOUR-WEBPUBSUB-ENDPOINT";
const SOCKET_PATH = "/clients/socketio/hubs/livechat";

export default function ChatPage() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef(null);
    const socketRef = useRef(null);
    const roomId = 1;

    useEffect(() => {
        loadMessages();
    }, []);

    useEffect(() => {
        socketRef.current = io(SOCKET_ENDPOINT, {
            path: SOCKET_PATH,
            transports: ["websocket", "polling"],
        });

        socketRef.current.on("connect", () => {
            console.log("socket connected", socketRef.current.id);
            socketRef.current.emit("join-room", roomId);
        });

        socketRef.current.on("new-message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socketRef.current.on("connect_error", (err) => {
            console.error("socket connect error:", err.message);
        });

        return () => {
            socketRef.current?.emit("leave-room", roomId);
            socketRef.current?.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function loadMessages() {
        try {
            setLoading(true);
            const res = await api.get(`/api/messages/${roomId}`);
            setMessages(res.data);
        } catch (error) {
            console.error("Load messages failed:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSend() {
        if (!messageText.trim()) return;
        try {
            await api.post(`/api/messages/${roomId}`, { messageText });
            setMessageText("");
        } catch (error) {
            console.error("Send message failed:", error);
        }
    }

    return (
        <div>
            {loading ? <p>Loading...</p> : null}
            {messages.map((msg) => (
                <div key={msg.id || msg.Id}>
                    <strong>{msg.username || msg.Username}</strong>:{" "}
                    {msg.messageText || msg.MessageText}
                </div>
            ))}
            <div ref={bottomRef} />
            <input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}
const styles = {
    page: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #f1f5f9 100%)",
        padding: "24px",
        fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },
    appShell: {
        maxWidth: "1200px",
        height: "88vh",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
        border: "1px solid #e2e8f0"
    },
    sidebar: {
        background:
            "linear-gradient(180deg, #0f172a 0%, #111827 55%, #172554 100%)",
        color: "#ffffff",
        padding: "24px 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    brandBlock: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "28px"
    },
    brandIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.12)",
        fontSize: "22px"
    },
    brandTitle: {
        fontSize: "20px",
        fontWeight: 700
    },
    brandSubtitle: {
        fontSize: "13px",
        color: "rgba(255,255,255,0.7)"
    },
    sectionLabel: {
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.5)",
        marginBottom: "12px"
    },
    roomCardActive: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.08)"
    },
    roomAvatar: {
        width: "42px",
        height: "42px",
        borderRadius: "14px",
        background: "#38bdf8",
        color: "#082f49",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700
    },
    roomName: {
        fontSize: "15px",
        fontWeight: 700
    },
    roomMeta: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.7)"
    },
    sidebarFooter: {
        marginTop: "24px"
    },
    userBadge: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.08)"
    },
    userAvatar: {
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        background: "#c4b5fd",
        color: "#312e81",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "16px"
    },
    userName: {
        fontSize: "14px",
        fontWeight: 700
    },
    userStatus: {
        fontSize: "12px",
        color: "#86efac"
    },
    chatPanel: {
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc"
    },
    chatHeader: {
        padding: "22px 24px",
        borderBottom: "1px solid #e2e8f0",
        background: "rgba(255,255,255,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    chatTitle: {
        fontSize: "24px",
        fontWeight: 800,
        color: "#0f172a"
    },
    chatSubtitle: {
        fontSize: "14px",
        color: "#64748b",
        marginTop: "4px"
    },
    refreshButton: {
        border: "1px solid #cbd5e1",
        background: "#ffffff",
        color: "#0f172a",
        borderRadius: "12px",
        padding: "10px 14px",
        fontWeight: 600,
        cursor: "pointer"
    },
    messagesArea: {
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background:
            "radial-gradient(circle at top, rgba(191,219,254,0.25), transparent 35%), #f8fafc"
    },
    emptyState: {
        margin: "auto",
        textAlign: "center",
        color: "#64748b"
    },
    emptyEmoji: {
        fontSize: "34px",
        marginBottom: "10px"
    },
    emptyTitle: {
        fontSize: "18px",
        fontWeight: 700,
        color: "#334155",
        marginBottom: "6px"
    },
    emptyText: {
        fontSize: "14px"
    },
    messageRow: {
        display: "flex",
        gap: "10px"
    },
    messageAvatar: {
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        background: "#dbeafe",
        color: "#1d4ed8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        flexShrink: 0,
        marginTop: "4px"
    },
    messageBubbleWrap: {
        display: "flex",
        flexDirection: "column",
        maxWidth: "72%"
    },
    messageSender: {
        fontSize: "12px",
        fontWeight: 700,
        color: "#64748b",
        marginBottom: "6px",
        marginLeft: "4px"
    },
    messageBubble: {
        padding: "12px 16px",
        borderRadius: "18px",
        fontSize: "15px",
        lineHeight: 1.45,
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
        wordBreak: "break-word"
    },
    myBubble: {
        background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
        color: "#ffffff",
        borderBottomRightRadius: "6px"
    },
    otherBubble: {
        background: "#ffffff",
        color: "#0f172a",
        border: "1px solid #e2e8f0",
        borderBottomLeftRadius: "6px"
    },
    messageTime: {
        fontSize: "11px",
        color: "#94a3b8",
        marginTop: "6px",
        padding: "0 4px"
    },
    inputBar: {
        padding: "18px 20px",
        borderTop: "1px solid #e2e8f0",
        background: "#ffffff",
        display: "flex",
        gap: "12px"
    },
    input: {
        flex: 1,
        borderRadius: "14px",
        border: "1px solid #cbd5e1",
        background: "#f8fafc",
        padding: "14px 16px",
        fontSize: "15px",
        outline: "none"
    },
    sendButton: {
        border: "none",
        borderRadius: "14px",
        background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
        color: "#ffffff",
        padding: "0 22px",
        fontWeight: 700,
        fontSize: "15px",
        cursor: "pointer",
        boxShadow: "0 10px 24px rgba(79, 70, 229, 0.24)"
    }
};