"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Chat = {
  id: string;
  messages: Message[];
};

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [trashedChats, setTrashedChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  useEffect(() => {
    const initialChat: Chat = {
      id: uuid(),
      messages: [{ role: "assistant", content: "Hello! How can I help you today?" }],
    };
    setChats([initialChat]);
    setSelectedChatId(initialChat.id);
  }, []);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  async function handleSend(sendMessage?: string) {
    const currentMessage = sendMessage ?? message;
    if (!currentMessage.trim() || !selectedChat) return;

    setIsLoading(true);
    const userMessage = { role: "user" as const, content: currentMessage };
    const updatedMessages = [...selectedChat.messages, userMessage];

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChatId ? { ...chat, messages: updatedMessages } : chat
      )
    );

    if (!sendMessage) {
      setMessage("");
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer dvdsovjsmvlmdslm",
        },
        body: JSON.stringify({
          message: currentMessage,
          messages: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.message) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === selectedChatId
              ? {
                  ...chat,
                  messages: [...chat.messages, { role: "assistant", content: data.message }],
                }
              : chat
          )
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "assistant", content: "Sorry, there was an error processing your request." },
                ],
              }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleShareConversation() {
    if (!selectedChat) return;
    try {
      const formattedConversation = selectedChat.messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n\n");
      await navigator.clipboard.writeText(formattedConversation);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to share:", error);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }

  function handleNewChat() {
    const newChat: Chat = {
      id: uuid(),
      messages: [{ role: "assistant", content: "Hello! How can I help you today?" }],
    };
    setChats((prev) => [...prev, newChat]);
    setSelectedChatId(newChat.id);
    setMessage("");
  }

  function handleTrashChat(chatId: string) {
    const chatToTrash = chats.find((c) => c.id === chatId);
    if (!chatToTrash) return;

    setChats((prev) => prev.filter((c) => c.id !== chatId));
    setTrashedChats((prev) => [...prev, chatToTrash]);

    if (selectedChatId === chatId) {
      const remainingChats = chats.filter((c) => c.id !== chatId);
      setSelectedChatId(remainingChats.length > 0 ? remainingChats[0].id : "");
    }
  }

  function handleDeleteFromTrash(chatId: string) {
    setTrashedChats((prev) => prev.filter((c) => c.id !== chatId));
  }

  function handleRestoreChat(chatId: string) {
    const chatToRestore = trashedChats.find((c) => c.id === chatId);
    if (!chatToRestore) return;

    setTrashedChats((prev) => prev.filter((c) => c.id !== chatId));
    setChats((prev) => [...prev, chatToRestore]);
    setSelectedChatId(chatId);
  }

  const quickActions = [
    {
      label: "Summarize This Article",
      prompt: "Summarize This Article (As you already mentioned)",
    },
    {
      label: "Find Related Articles",
      prompt: "Find Related Articles Suggest additional articles or sources based on the current one.",
    },
    {
      label: "Generate Keywords/Tags",
      prompt: "Generate Keywords/Tags Extract and display important keywords or tags from the article.",
    },
    {
      label: "Analyze Key Points",
      prompt: "Analyze Key Points",
    },
  ];

  function handleQuickAction(prompt: string) {
    const combinedMessage = `${prompt} ${message.trim()}`;
    handleSend(combinedMessage);
  }

  function formatMessageContent(content: string) {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(linkRegex);

    return parts.map((part, i) =>
      linkRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 underline break-words"
        >
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {showShareSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg font-medium">
          Copied to clipboard!
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-semibold text-lg">Active Chats</h2>
          <button
            onClick={handleNewChat}
            className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
          >
            New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center justify-between p-2 rounded-lg text-gray-200 cursor-pointer ${
                chat.id === selectedChatId ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
              onClick={() => setSelectedChatId(chat.id)}
            >
              <div className="flex-1 truncate">
                Chat: {chat.id.slice(0, 8)}…
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrashChat(chat.id);
                }}
                className="text-gray-400 hover:text-red-500 transition-all ml-2"
                title="Trash chat"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        <h2 className="text-white font-semibold text-lg mt-4 mb-2">Trash</h2>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {trashedChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center justify-between p-2 rounded-lg text-gray-300 hover:bg-gray-800"
            >
              <div className="flex-1 truncate">
                Trashed: {chat.id.slice(0, 8)}…
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRestoreChat(chat.id)}
                  className="text-gray-400 hover:text-green-500 transition-all"
                  title="Restore chat"
                >
                  ♻
                </button>
                <button
                  onClick={() => handleDeleteFromTrash(chat.id)}
                  className="text-gray-400 hover:text-red-500 transition-all"
                  title="Delete permanently"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1">
        {/* Top header bar */}
        <div className="w-full bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">Chat</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-blue-700 transition-all"
                title="Copy chat link"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto pb-32 pt-4 px-4 custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            {selectedChat ? (
              <>
                {selectedChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 mb-4 ${
                      msg.role === "assistant" ? "justify-start" : "justify-end flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                        msg.role === "assistant"
                          ? "bg-white border border-gray-300 text-gray-900"
                          : "bg-blue-600 text-white"
                      }`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {formatMessageContent(msg.content)}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 mb-4 justify-start">
                    <div className="px-4 py-2 rounded-2xl bg-white border border-gray-300 text-gray-600 flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500 text-center mt-4">No chat selected</div>
            )}
          </div>
        </div>

        {selectedChatId && selectedChat && (
          <div className="fixed bottom-0 left-64 right-0 bg-gray-200 border-t border-gray-300 p-4">
            <div className="max-w-3xl mx-auto flex flex-col gap-3">
              {/* Quick action buttons */}
              <div className="flex gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-blue-100 transition-all text-sm font-medium"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Message input and send button */}
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 font-medium"
                >
                  {isLoading ? "..." : "Send"}
                </button>
                <button
                  onClick={handleShareConversation}
                  className="bg-gray-300 text-gray-800 p-3 rounded-xl hover:bg-blue-100 transition-all"
                  title="Share conversation"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
