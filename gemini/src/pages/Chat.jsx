import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Hello! I'm your AI assistant powered by Google Gemini. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const { toast } = useToast();


  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      // Make a fetch call to your backend server's chat endpoint
      const response = await fetch('https://ai-assistant-pro-1vly.onrender.com/chat', { // <-- IMPORTANT: Ensure this URL is correct for your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputMessage }),
      });

      if (!response.ok) {
        // Parse error response from backend if available
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Backend error: ${response.status} - ${errorData.error || 'Failed to fetch AI response'}`);
      }

      const data = await response.json();
      const aiResponseContent = data.aiResponse; // Backend should send 'aiResponse' property

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent, // Use the actual AI response text from backend
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Save chat history to local storage
      const savedChats = JSON.parse(localStorage.getItem("chatHistory") || "[]");
      savedChats.push(userMessage, aiMessage);
      localStorage.setItem("chatHistory", JSON.stringify(savedChats));
    } catch (error) {
      console.error("Error communicating with backend:", error); // Log the actual error for debugging
      toast({
        title: "Chat Error",
        description: `Failed to get AI response: ${error.message}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className=" mx-auto flex justify-center pt-10">
        <Card className="w-5xl">
          <h1 className="text-2xl font-bold flex gap-2 pb-2">
              <Bot className="h-8 w-8 text-blue-600" />
              AI Chat Assistant
            </h1>

          <CardContent className="flex flex-col h-full p-0 content-between">
            <div>
            <ScrollArea className="flex-1 px-6 border-none bg-white pt-5" ref={scrollAreaRef}>
              <div className="space-y-4 pb-65">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                        <Bot className="h-4 w-4 text-blue-600 dark:text-blue-200" />
                      </div>
                    )}

                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white dark:bg-blue-800"
                          : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block dark:text-gray-300">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>

                    {message.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-600">
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                      <Bot className="h-4 w-4 text-blue-600 dark:text-blue-200" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 dark:bg-gray-700">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-300" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">AI is typing...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            </div>

            <div className=" p-4 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                />
                <Button type="submit" disabled={loading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </Layout>
  );
};

export default Chat;
