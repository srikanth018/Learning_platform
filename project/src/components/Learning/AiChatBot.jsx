import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import axios from "axios";
import parse from "html-react-parser";

function AiChatBot() {
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState("");
  const chatBoxRef = useRef(null);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot", {
        message: inputMessage,
      });
      const messageData = response.data.message;

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: inputMessage },
        { role: "bot", content: messageData },
      ]);

      setInputMessage(""); // Clear input after submission

      // Scroll to bottom when new message is added
      setTimeout(() => {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }, 100);
    } catch (error) {
      setError("Failed to send message. Please try again.");
      console.error(error);
    }
  };

  // Function to strip unnecessary symbols and highlight code
  const formatMessage = (content) => {
    // Remove symbols like '*' and format message
    const cleanedContent = content.replace(/[*]/g, "");

    // Highlight code blocks if any (you can modify the regex for more robust detection)
    const formattedContent = cleanedContent.replace(
      /```(.*?)```/gs, // Code block pattern (e.g., ```code```)
      (match, code) => `<pre class="bg-gray-100 text-black font-medium p-4 rounded-md"><code>${code}</code></pre>`
    );

    return parse(formattedContent);
  };

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  return (
    <div className={`min-h-screen w-full flex ${theme === "light" ? "bg-gray-100" : "bg-gray-900"}`}>
      <Sidebar theme={theme} />
      <div className="flex-1 flex flex-col">
        <Header theme={theme} dark={setTheme} />

        <div className="flex flex-col items-center justify-center bg-gray-100 px-6">
          <h1 className="text-2xl font-bold mb-4 text-blue-600">LearnGlobs AI Chatbot</h1>

          <div className={`w-full shadow-lg rounded-lg flex flex-col justify-between h-[600px]  border-2   ${
            chatHistory.length === 0 ?"bg-white":"bg-indigo-100 border-sky-600"
          }`}>
            {/* Chat history */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              ref={chatBoxRef}
            >
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-700 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-8 shadow-lg animate-fadeIn">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">Welcome to LearnGlobs AI Chatbot!</h2>
                {/* <p className="text-lg mb-2">How can I assist you today?</p> */}
                <p className="text-lg font-light italic text-gray-600 mb-6">Type a message below to start your conversation.</p>
                
                <div className="text-left bg-sky-100 p-6 rounded-md shadow-md mx-auto max-w-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Here’s what I can help you with:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li><span className="font-semibold text-blue-500">Write code</span> in various programming languages like JavaScript, Python, Java, and more.</li>
                    <li><span className="font-semibold text-blue-500">Explain complex topics</span> in simple terms to enhance your learning.</li>
                    <li><span className="font-semibold text-blue-500">Provide recommendations</span> for books, movies, or technical resources.</li>
                    <li><span className="font-semibold text-blue-500">Assist with debugging</span> and code optimization.</li>
                    <li><span className="font-semibold text-blue-500">Answer any questions</span> related to technology, science, and more.</li>
                  </ul>
                </div>
              
                <p className="text-sm text-gray-500 mt-6">Your personal AI assistant is ready to help. Just ask away!</p>
              </div>
              
              
              ) : (
                chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      chat.role === "bot" ? "justify-start" : "justify-end"
                    } `}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-5xl ${
                        chat.role === "bot"
                          ? "bg-gray-500 text-gray-100"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {formatMessage(chat.content)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input form */}
            <form
              onSubmit={handleSubmit}
              className="bg-gray-100 p-4 flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                placeholder="Type your message..."
                autoFocus
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
              >
                Send
              </button>
            </form>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiChatBot;
