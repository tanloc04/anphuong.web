import axiosClient from "./axiosClient";

export const chatApi = {
  getChatHistory(userId: number) {
    return axiosClient.get(`/chat/history/${userId}`);
  },
  getChatUsers() {
    return axiosClient.get(`/chat/users`);
  },
  markRead(userId: number, role: string) {
    return axiosClient.post(`/chat/mark-read/${userId}?role=${role}`);
  },
};
