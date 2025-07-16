"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useChatStore } from "@/lib/stores/chat-store"

interface DeleteChatroomDialogProps {
  chatroomId: string | null
  onClose: () => void
  onConfirm: (chatroomId: string) => void
}

export function DeleteChatroomDialog({ chatroomId, onClose, onConfirm }: DeleteChatroomDialogProps) {
  const { chatrooms } = useChatStore()
  const chatroom = chatrooms.find((room) => room.id === chatroomId)

  return (
    <AlertDialog open={!!chatroomId} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Chatroom</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{chatroom?.title}"? This action cannot be undone and all messages will be
            permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => chatroomId && onConfirm(chatroomId)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
