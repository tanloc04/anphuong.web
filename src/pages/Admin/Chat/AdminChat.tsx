import React, { useState, useEffect, useRef } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { chatApi } from "@/api/chatApi";
import { useAuth } from "@/context/auth.context";
import type { ChatUser, AdminChatMessage } from "@/@types/chat.types";

const AdminChat = () => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserIdRef = useRef<number | null>(null);

  useEffect(() => {
    currentUserIdRef.current = selectedUserId;
  }, [selectedUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 👇 1. ĐƯA KHỞI TẠO RA NGOÀI ĐỂ CLEANUP DỄ DÀNG HƠN
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5273/chatHub")
      .withAutomaticReconnect()
      .build();

    const initAdminChat = async () => {
      try {
        const res = await chatApi.getChatUsers();
        if (res.data?.success) setChatUsers(res.data.data);
      } catch (error) {
        console.error(error);
      }

      // 🔥 FIX LỖI NHẬN DATA TỪ HUB: Hub đang gửi nguyên object ChatMessage
      newConnection.on("ReceiveMessage", (newMsg: AdminChatMessage) => {
        // Nếu tin nhắn thuộc về người Admin đang mở xem
        if (currentUserIdRef.current === newMsg.userId) {
          setMessages((prev) => [...prev, newMsg]);
          // Vì đang mở xem nên đánh dấu đọc luôn
          chatApi
            .markRead(newMsg.userId, "Admin")
            .catch((e) => console.error(e));
        }

        // Cập nhật danh sách Sidebar (Đẩy người mới lên đầu + tăng Unread nếu chưa mở)
        setChatUsers((prev) => {
          const isCurrentlyOpen = currentUserIdRef.current === newMsg.userId;

          let updatedList = prev.map((u) => {
            if (u.userId === newMsg.userId) {
              return {
                ...u,
                lastMessageTime: newMsg.timestamp,
                // Nếu đang KHÔNG mở xem người này -> Tăng số tin chưa đọc lên 1
                unreadCount: isCurrentlyOpen ? 0 : (u.unreadCount || 0) + 1,
              };
            }
            return u;
          });

          // Nếu là khách hoàn toàn mới nhắn lần đầu
          if (!updatedList.find((u) => u.userId === newMsg.userId)) {
            updatedList.push({
              userId: newMsg.userId,
              lastMessageTime: newMsg.timestamp,
              unreadCount: isCurrentlyOpen ? 0 : 1,
            });
          }

          // Sort lại: ai nhắn mới nhất lên đầu
          return updatedList.sort(
            (a, b) =>
              new Date(b.lastMessageTime).getTime() -
              new Date(a.lastMessageTime).getTime(),
          );
        });
      });

      try {
        await newConnection.start();
        await newConnection.invoke("JoinAdminRoom");
        setConnection(newConnection);
      } catch (e) {
        console.error(e);
      }
    };

    initAdminChat();

    // 👇 2. CLEANUP DỨT KHOÁT ĐÓNG ĐÚNG CONNECTION NÀY
    return () => {
      newConnection.stop();
    };
  }, []); // Chỉ chạy 1 lần khi mount, nhờ có currentUserIdRef

  const handleSelectUser = async (uId: number) => {
    setSelectedUserId(uId);
    try {
      // 1. Xóa số đỏ chưa đọc trên UI
      setChatUsers((prev) =>
        prev.map((u) => (u.userId === uId ? { ...u, unreadCount: 0 } : u)),
      );

      // 2. Báo server đã đọc
      await chatApi.markRead(uId, "Admin");

      // 3. Load lịch sử
      const res = await chatApi.getChatHistory(uId);
      if (res.data?.success) setMessages(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !connection || !selectedUserId) return;

    try {
      await connection.invoke("SendMessageToUser", selectedUserId, inputText);
      setMessages((prev) => [
        ...prev,
        {
          userId: selectedUserId,
          sender: "Admin",
          content: inputText,
          timestamp: new Date().toISOString(),
        },
      ]);
      setInputText("");

      // Đẩy hội thoại này lên đầu
      setChatUsers((prev) => {
        let list = prev.map((u) =>
          u.userId === selectedUserId
            ? { ...u, lastMessageTime: new Date().toISOString() }
            : u,
        );
        return list.sort(
          (a, b) =>
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime(),
        );
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 bg-gray-100 border-b border-gray-200 font-bold text-gray-700">
          Danh sách hội thoại
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatUsers.map((u) => (
            <div
              key={u.userId}
              onClick={() => handleSelectUser(u.userId)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors flex justify-between items-center ${
                selectedUserId === u.userId
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : "hover:bg-gray-200"
              }`}
            >
              <div>
                <div className="font-semibold text-gray-800">
                  Khách hàng #{u.userId}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(u.lastMessageTime).toLocaleString("vi-VN")}
                </div>
              </div>
              {/* NỔ BONG BÓNG ĐỎ NẾU CÓ TIN NHẮN CHƯA ĐỌC */}
              {u.unreadCount > 0 && (
                <Badge value={u.unreadCount} severity="danger" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!selectedUserId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        ) : (
          <>
            <div className="p-4 bg-white border-b border-gray-200 font-bold text-gray-800 shadow-sm z-10">
              Đang hỗ trợ Khách hàng #{selectedUserId}
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
              {messages.map((msg, idx) => {
                const isAdmin = msg.sender === "Admin";
                return (
                  <div
                    key={idx}
                    className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl text-sm ${isAdmin ? "bg-blue-600 text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"}`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={sendMessage}
              className="p-4 bg-white border-t border-gray-200 flex gap-2"
            >
              <InputText
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập câu trả lời..."
                className="flex-1 p-inputtext-sm rounded-lg"
              />
              <Button
                type="submit"
                icon="pi pi-send"
                className="rounded-lg bg-blue-600 border-none"
                disabled={!inputText.trim()}
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
