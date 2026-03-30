import React from "react";

export default function ChatPage() {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Live Chat Application</h1>
            <h2>Chat Page</h2>
            <p>Welcome, {user?.username || "User"}</p>
        </div>
    );
}