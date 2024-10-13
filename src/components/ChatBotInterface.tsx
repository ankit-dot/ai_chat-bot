"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Save, Plus, Loader2, AlertCircle, LogOut, LayoutDashboard } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from 'axios'
import { useAppSelector } from '@/lib/store/hooks'
import { deleteCookie } from 'cookies-next'
interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatBotInterface() {
  const router = useRouter()
  const { user_id, chat_id } = useParams()
  const user = useAppSelector((state) => state.user.user)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [sidebarData, setSidebarData] = useState<any>([])
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sidebarLoading, setSidebarLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSidebarLoading(true)
    setError(null)
    axios.get(`/api/chat-history/${user_id}`)
      .then(response => {
        setSidebarData(response.data)
      })
      .catch(error => {
        console.error('Error loading chat history:', error)
        setError('Failed to load chat history. Please try again.')
      })
      .finally(() => {
        setSidebarLoading(false)
      })
  }, [])

  useEffect(() => {
    if (chat_id && chat_id !== 'new_chat') {
      setLoading(true)
      setError(null)
      axios.get(`/api/chat/${chat_id}`)
        .then(response => {
          const chatMessages = response.data.messages.map((msg: any) => ({
            content: msg.content,
            sender: msg.sender,
            timestamp: msg.timestamp,
          }))
          setMessages(chatMessages)
        })
        .catch(error => {
          console.error('Error loading chat history:', error)
          setError('Failed to load chat messages. Please try again.')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [chat_id])

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return

    setMessages([...messages, { content: inputMessage, sender: 'user', timestamp: new Date() }])
    setInputMessage('')

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'bot', content: 'This is a simulated response from the chatbot.', timestamp: new Date() }
      ])
    }, 1500)
  }

  const handleSaveChat = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`/api/chat-history/${user_id}`, {
        messages,
        chatId: chat_id === 'new_chat' ? null : chat_id
      })
      
      const savedChatId = response.data.chatId
      if (chat_id === 'new_chat') {
        router.push(`/${user_id}/${savedChatId}`)
      }
      alert('Chat saved successfully!')
    } catch (error) {
      console.error('Error saving chat:', error)
      setError('Failed to save chat. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    router.push(`/${user_id}/new_chat`)
    setMessages([])
  }

  const handleSidebarChat = (newChatID: string) => {
    router.push(`/${user_id}/${newChatID}`)
  }

  const handleDashboard = () => {
    router.push(`/${user_id}/dashboard`)
  }

  const handleLogout = () => {
    console.log('Logout clicked')
  
    // Delete the user cookie
    deleteCookie('user')
  
    // After logout, redirect to the login page
    
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r sm:flex flex-col hidden border-gray-200">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <Button onClick={handleNewChat} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-grow">
          {sidebarLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="p-2">
              {sidebarData.map((chatData:any, i:number) => (
                <Button
                  key={chatData._id}
                  variant="ghost"
                  className={`${chatData?._id === chat_id ? "bg-gray-300" :""} w-full justify-start text-left mb-1`}
                  onClick={() => handleSidebarChat(chatData._id)}
                >
                  Chat {i + 1}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-4 border-t border-gray-200">
          <Button onClick={handleDashboard} className="w-full mb-2" variant="outline">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button onClick={handleLogout} className="w-full" variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start mb-4 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="mr-2">
                      <AvatarFallback>
                        <Bot className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="ml-2">
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center text-gray-500">
                  <Bot className="w-5 h-5 mr-2" />
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 mr-2"
            />
            <Button onClick={handleSendMessage} className="mr-2">
              <Send className="w-4 h-4" />
            </Button>
            <Button onClick={handleSaveChat} variant="outline" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? "Saving..." : "Save Chat"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}