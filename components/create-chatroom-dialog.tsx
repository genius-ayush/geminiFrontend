"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import { useToast } from "@/hooks/use-toast"

import { toast } from "sonner"
import { useChatStore } from "@/lib/stores/chat-store"
import { Loader2 } from "lucide-react"

const chatroomSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title must be less than 50 characters"),
})

type ChatroomForm = z.infer<typeof chatroomSchema>

interface CreateChatroomDialogProps {
  children: React.ReactNode
}

export function CreateChatroomDialog({ children }: CreateChatroomDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()
  const { createChatroom } = useChatStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatroomForm>({
    resolver: zodResolver(chatroomSchema),
  })

  const onSubmit = async (data: ChatroomForm) => {
    setIsLoading(true)
    try {
      await createChatroom(data.title)
      toast("Chatroom Created" ,{
        description: `"${data.title}" has been created successfully.`,
      })
      setOpen(false)
      reset()
    } catch (error) {
      toast("Error" ,{
        description: "Failed to create chatroom. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chatroom</DialogTitle>
          <DialogDescription>Give your chatroom a name to start chatting with Gemini.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Chatroom Title</Label>
            <Input {...register("title")} placeholder="Enter chatroom title..." autoFocus />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
