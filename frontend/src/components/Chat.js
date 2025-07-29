import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("load_message", (message) => {
      setChat(message);
    });

    return () => {
      socket.off("receive_message");
      socket.off("load_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && name.trim()) {
      const data = { name, message };
      socket.emit("sendMessage", data);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded shadow">
        {!name ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Enter your name</h2>
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. Ram or Shyam"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nameInput.trim()) {
                  setName(nameInput.trim());
                }
              }}
            />
            <button
              onClick={() => nameInput.trim() && setName(nameInput.trim())}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Join Chat
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Welcome, {name}</h2>
            <div className="h-80 overflow-y-auto mb-4 space-y-2">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.name === name ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.name === name
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <span className="block text-sm font-semibold">
                      {msg.name}
                    </span>
                    <span>{msg.message}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 border px-3 py-2 rounded"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
