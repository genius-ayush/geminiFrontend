"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useChatStore } from "@/lib/stores/chat-store"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChatMessage } from "@/components/chat-message"
import { TypingIndicator } from "@/components/typing-indicator"
import { ImageUpload } from "@/components/image-upload"
import { ArrowLeft, Send, ImageIcon, Loader2 } from "lucide-react"

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const params = useParams()
  const { user } = useAuthStore()
  const { currentChatroom, messages, isTyping, loadChatroom, loadMessages, sendMessage, loadMoreMessages } =
    useChatStore()

  const chatroomId = params.id as string

  useEffect(() => {
    if (!user) {
      router.push("/") // Redirect to landing page instead of login
      return
    }

    if (chatroomId) {
      loadChatroom(chatroomId)
      loadMessages(chatroomId)
    }
  }, [user, chatroomId, router, loadChatroom, loadMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleScroll = async () => {
    const container = messagesContainerRef.current
    if (!container || !hasMoreMessages) return

    if (container.scrollTop === 0) {
      setIsLoading(true)
      try {
        const moreMessages = await loadMoreMessages(chatroomId)
        if (moreMessages.length === 0) {
          setHasMoreMessages(false)
        }
      } catch (error) {
        toast("Error" ,{
          description: "Failed to load more messages.",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !chatroomId) return

    const messageText = message.trim()
    setMessage("")

    try {
      await sendMessage(chatroomId, messageText)
      toast("Message Sent" , {
        description: "Your message has been sent.",
      })
    } catch (error) {
      toast("Error",{
        description: "Failed to send message. Please try again.",
      })
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!chatroomId) return

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageData = e.target?.result as string
        await sendMessage(chatroomId, "", imageData)
        toast( "Image Sent", {
          description: "Your image has been sent.",
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast("Error" ,{
        description: "Failed to send image. Please try again.",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  if (!user || !currentChatroom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-semibold">{currentChatroom.title}</h1>
            <p className="text-sm text-muted-foreground">{messages.length} messages</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll"
        onScroll={handleScroll}
      >
        {isLoading && hasMoreMessages && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="h-4 w-4" />
          </Button>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            maxLength={1000}
          />

          <Button type="submit" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <ImageUpload ref={fileInputRef} onImageUpload={handleImageUpload} />
      </div>
    </div>
  )
}
