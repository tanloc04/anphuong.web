export interface ChatMessage {
  id?: number;
  sender: string;
  content: string;
  timestamp: string;
}

export interface ChatUser {
  userId: number;
  lastMessageTime: string;
  unreadCount: number;
}

export interface AdminChatMessage {
  id?: number;
  userId: number;
  sender: string;
  content: string;
  timestamp: string;
}
