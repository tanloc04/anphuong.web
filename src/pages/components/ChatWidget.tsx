import React, { useState, useEffect, useRef } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge"; // 👈 Thêm thư viện Badge
import { useAuth } from "@/context/auth.context";
import { chatApi } from "@/api/chatApi";
import type { ChatMessage } from "@/@types/chat.types";

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getChatUserId = () => {
    if (user?.id) return user.id;
    let guestId = localStorage.getItem("guest_chat_id");
    if (!guestId) {
      guestId = Math.floor(Math.random() * 1000000).toString();
      localStorage.setItem("guest_chat_id", guestId);
    }
    return parseInt(guestId);
  };

  const chatUserId = getChatUserId();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("/chatHub")
      .withAutomaticReconnect()
      .build();

    const initChat = async () => {
      // 1. Lấy lịch sử Chat từ API
      try {
        const res = await chatApi.getChatHistory(chatUserId);
        if (res.data && res.data.success) {
          setMessages(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi load lịch sử chat:", error);
      }

      // 2. Lắng nghe tin nhắn từ Server
      newConnection.on("ReceiveMessage", (message: ChatMessage) => {
        setMessages((prev) => [...prev, message]);

        // 👈 TĂNG SỐ ĐỎ NẾU KHUNG CHAT ĐANG ĐÓNG
        setIsOpen((currentIsOpen) => {
          if (!currentIsOpen) {
            setUnreadCount((prev) => prev + 1);
          }
          return currentIsOpen;
        });
      });

      try {
        await newConnection.start();
        console.log("Đã kết nối ChatHub!");

        // Gọi hàm Join Room trên backend
        await newConnection.invoke("JoinUserRoom", chatUserId);
        setConnection(newConnection);
      } catch (e) {
        console.error("Lỗi kết nối SignalR: ", e);
      }
    };

    initChat();

    // 👈 2. CLEANUP DỨT KHOÁT: Đóng đúng cái connection vừa tạo
    return () => {
      newConnection.stop();
    };
  }, [chatUserId]);

  // 👈 3. HÀM XỬ LÝ KHI MỞ KHUNG CHAT (XÓA SỐ ĐỎ & BÁO SERVER ĐÃ ĐỌC)
  const toggleChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
    chatApi
      .markRead(chatUserId, "User")
      .catch((e) => console.error("Lỗi mark read:", e));
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !connection) return;

    try {
      await connection.invoke("SendMessageToAdmin", chatUserId, inputText);

      const newMsg: ChatMessage = {
        sender: "User",
        content: inputText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setInputText("");
    } catch (e) {
      console.error("Lỗi gửi tin nhắn: ", e);
    }
  };

  return (
    <div className="fixed bottom-32 right-6 z-50">
      {/* Khung Chat */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-fade-in origin-bottom-right transition-all">
          <div className="bg-[#c4a484] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#c4a484] font-bold text-xl">
                A
              </div>
              <div>
                <h3 className="font-bold">An Phương Support</h3>
                <p className="text-xs text-white/80">
                  Chúng tôi trả lời ngay lập tức
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <i className="pi pi-times text-xl"></i>
            </button>
          </div>

          <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 my-auto text-sm">
                Hãy để lại lời nhắn, chúng tôi sẽ hỗ trợ bạn ngay!
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender === "User";
                return (
                  <div
                    key={index}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                        isMe
                          ? "bg-[#c4a484] text-white rounded-br-sm"
                          : "bg-gray-200 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="p-3 bg-white border-t border-gray-100 flex gap-2"
          >
            <InputText
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 p-inputtext-sm rounded-full border-gray-300 px-4"
            />
            <Button
              type="submit"
              icon="pi pi-send"
              className="rounded-full w-10 h-10 !bg-[#c4a484] !border-none hover:!bg-[#a88b6e]"
              disabled={!inputText.trim()}
            />
          </form>
        </div>
      )}

      {/* 👈 4. GẮN BADGE VÀ ĐỔI HÀM ONCLICK CHỖ NÀY */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="relative w-14 h-14 bg-[#c4a484] rounded-full shadow-xl flex items-center justify-center text-white hover:bg-[#a88b6e] transition-transform hover:scale-110 active:scale-95 animate-bounce"
        >
          <i className="pi pi-comments text-2xl"></i>
          {unreadCount > 0 && (
            <Badge
              value={unreadCount}
              severity="danger"
              className="absolute -top-2 -right-2"
            />
          )}
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
