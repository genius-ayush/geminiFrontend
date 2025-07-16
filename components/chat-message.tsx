"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Message } from "@/lib/stores/chat-store"
import { Copy, Check, User, Bot } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      toast("Copied" , {
        description: "Message copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast("Error" ,{
        description: "Failed to copy message."
      })
    }
  }

  return (
    <div className={cn("flex gap-3 group", message.isUser ? "justify-end" : "justify-start")}>
      {!message.isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2 relative",
          message.isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {message.imageUrl && (
              <div className="mb-2">
                <img
                  src={message.imageUrl || "/placeholder.svg"}
                  alt="Uploaded image"
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}
            {message.content && <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0",
              message.isUser ? "text-primary-foreground/70 hover:text-primary-foreground" : "",
            )}
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>

        <div
          className={cn(
            "text-xs mt-1 opacity-70",
            message.isUser ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </div>
      </div>

      {message.isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  )
}
