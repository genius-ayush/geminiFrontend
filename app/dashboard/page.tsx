"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useChatStore } from "@/lib/stores/chat-store"
import { ThemeToggle } from "@/components/theme-toggle"

import { toast } from "sonner"
import { CreateChatroomDialog } from "@/components/create-chatroom-dialog"
import { DeleteChatroomDialog } from "@/components/delete-chatroom-dialog"

import { useDebounce } from "@/hooks/use-debounce"
import { MessageCircle, Plus, Search, Trash2, LogOut, User, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChatroom, setSelectedChatroom] = useState<string | null>(null)
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { chatrooms, loadChatrooms, deleteChatroom } = useChatStore()

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    if (!user) {
      router.push("/") // Redirect to landing page instead of login
      return
    }
    loadChatrooms()
  }, [user, router, loadChatrooms])

  const filteredChatrooms = chatrooms.filter((chatroom) =>
    chatroom.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
  )

  const handleDeleteChatroom = async (chatroomId: string) => {
    try {
      await deleteChatroom(chatroomId)
      toast("Chatroom Deleted" ,{
        description: "The chatroom has been successfully deleted.",
      })
      setSelectedChatroom(null)
    } catch (error) {
      toast("Error" , {
        description: "Failed to delete chatroom. Please try again.",
      })
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
    toast("Logged Out" , {
      description: "You have been successfully logged out.",
    })
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Gemini Chat</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chatrooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <CreateChatroomDialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </CreateChatroomDialog>
        </div>

        {/* Chatrooms Grid */}
        {filteredChatrooms.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{searchQuery ? "No chatrooms found" : "No chatrooms yet"}</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Create your first chatroom to start chatting with Gemini"}
            </p>
            {!searchQuery && (
              <CreateChatroomDialog>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Chatroom
                </Button>
              </CreateChatroomDialog>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChatrooms.map((chatroom) => (
              <Card
                key={chatroom.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => router.push(`/chat/${chatroom.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{chatroom.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(chatroom.updatedAt), { addSuffix: true })}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedChatroom(chatroom.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{chatroom.messageCount} messages</Badge>
                    <div className="text-sm text-muted-foreground">Click to open</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteChatroomDialog
        chatroomId={selectedChatroom}
        onClose={() => setSelectedChatroom(null)}
        onConfirm={handleDeleteChatroom}
      />
    </div>
  )
}
