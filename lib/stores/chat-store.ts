import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Message {
  id: string
  content: string
  imageUrl?: string
  isUser: boolean
  timestamp: Date
  chatroomId: string
}

export interface Chatroom {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount: number
}

interface ChatState {
  chatrooms: Chatroom[]
  currentChatroom: Chatroom | null
  messages: Message[]
  isTyping: boolean
  currentPage: number
  loadChatrooms: () => void
  createChatroom: (title: string) => Promise<Chatroom>
  deleteChatroom: (id: string) => Promise<void>
  loadChatroom: (id: string) => void
  loadMessages: (chatroomId: string) => void
  loadMoreMessages: (chatroomId: string) => Promise<Message[]>
  sendMessage: (chatroomId: string, content: string, imageUrl?: string) => Promise<void>
}

// Simulate AI responses
const AI_RESPONSES = [
  "That's an interesting question! Let me think about that for a moment.",
  "I understand what you're asking. Here's my perspective on that topic.",
  "Great point! I'd like to add some thoughts to what you've shared.",
  "That's a fascinating topic. Let me provide you with some insights.",
  "I appreciate you sharing that with me. Here's what I think about it.",
  "That's a thoughtful question. Let me break this down for you.",
  "I see what you mean. Here's how I would approach that situation.",
  "That's definitely worth exploring further. Let me share some ideas.",
  "Interesting perspective! I have some thoughts that might be helpful.",
  "That's a complex topic. Let me try to explain it in a simple way.",
]

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      currentChatroom: null,
      messages: [],
      isTyping: false,
      currentPage: 1,

      loadChatrooms: () => {
        // Simulate loading from storage - data is already persisted
      },

      createChatroom: async (title: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const newChatroom: Chatroom = {
          id: Math.random().toString(36).substr(2, 9),
          title,
          createdAt: new Date(),
          updatedAt: new Date(),
          messageCount: 0,
        }

        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
        }))

        return newChatroom
      },

      deleteChatroom: async (id: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500))

        set((state) => ({
          chatrooms: state.chatrooms.filter((room) => room.id !== id),
          messages: state.messages.filter((msg) => msg.chatroomId !== id),
          currentChatroom: state.currentChatroom?.id === id ? null : state.currentChatroom,
        }))
      },

      loadChatroom: (id: string) => {
        const { chatrooms } = get()
        const chatroom = chatrooms.find((room) => room.id === id)
        set({ currentChatroom: chatroom || null })
      },

      loadMessages: (chatroomId: string) => {
        const { messages } = get()
        const chatroomMessages = messages
          .filter((msg) => msg.chatroomId === chatroomId)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

        set({
          messages: chatroomMessages,
          currentPage: 1,
        })
      },

      loadMoreMessages: async (chatroomId: string) => {
        const { currentPage } = get()
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simulate loading older messages
        const olderMessages: Message[] = Array.from({ length: 10 }, (_, i) => ({
          id: Math.random().toString(36).substr(2, 9),
          content: `This is an older message ${currentPage * 10 + i + 1}`,
          isUser: Math.random() > 0.5,
          timestamp: new Date(Date.now() - (currentPage * 10 + i + 1) * 60000),
          chatroomId,
        }))

        set((state) => ({
          messages: [...olderMessages, ...state.messages],
          currentPage: state.currentPage + 1,
        }))

        return olderMessages
      },

      sendMessage: async (chatroomId: string, content: string, imageUrl?: string) => {
        const userMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          content,
          imageUrl,
          isUser: true,
          timestamp: new Date(),
          chatroomId,
        }

        // Add user message
        set((state) => ({
          messages: [...state.messages, userMessage],
          isTyping: true,
        }))

        // Update chatroom
        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId ? { ...room, updatedAt: new Date(), messageCount: room.messageCount + 1 } : room,
          ),
        }))

        // Simulate AI thinking time (1-3 seconds)
        const thinkingTime = Math.random() * 2000 + 1000
        await new Promise((resolve) => setTimeout(resolve, thinkingTime))

        // Generate AI response
        const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]
        const aiMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          content: aiResponse,
          isUser: false,
          timestamp: new Date(),
          chatroomId,
        }

        set((state) => ({
          messages: [...state.messages, aiMessage],
          isTyping: false,
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId ? { ...room, updatedAt: new Date(), messageCount: room.messageCount + 1 } : room,
          ),
        }))
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        chatrooms: state.chatrooms,
        messages: state.messages,
      }),
    },
  ),
)
