import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  MessageSquare,
  FileText,
  Code,
  Heart,
  Clock,
  TrendingUp,
  Star,
  Calendar
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"; // Make sure ScrollArea is imported
import Layout from "@/components/Layout";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalChats: 0,
    contentGenerated: 0,
    codeAnalyzed: 0,
    favorites: 0,
  });
  const [recentHistory, setRecentHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load history and calculate stats
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    const contentHistory = JSON.parse(localStorage.getItem("contentHistory") || "[]");
    const codeHistory = JSON.parse(localStorage.getItem("codeHistory") || "[]");
    const favoritesData = JSON.parse(localStorage.getItem("favorites") || "[]");

    setStats({
      totalChats: chatHistory.length / 2, // Divide by 2 because we store both user and AI messages
      contentGenerated: contentHistory.length,
      codeAnalyzed: codeHistory.length,
      favorites: favoritesData.length,
    });

    // Combine all history and sort by timestamp
    const allHistory = [
      ...chatHistory.map((item) => ({ ...item, type: "chat" })),
      ...contentHistory,
      ...codeHistory,
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setRecentHistory(allHistory.slice(0, 20)); // Limiting to 20 for a more manageable scroll
    setFavorites(favoritesData);
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case "chat": return <MessageSquare className="h-4 w-4" />;
      case "summarize":
      case "blog":
      case "tweet":
      case "caption": return <FileText className="h-4 w-4" />;
      case "explain":
      case "optimize":
      case "debug": return <Code className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "chat": return "bg-blue-100 text-blue-700";
      case "summarize":
      case "blog":
      case "tweet":
      case "caption": return "bg-green-100 text-green-700";
      case "explain":
      case "optimize":
      case "debug": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || user?.email || "User"}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's your AI assistant activity overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Chats</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalChats}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Active conversations</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Content Generated</p>
                  <p className="text-3xl font-bold text-green-600">{stats.contentGenerated}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Articles & posts</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Code Analyzed</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.codeAnalyzed}</p>
                </div>
                <Code className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Functions reviewed</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Favorites</p>
                  <p className="text-3xl font-bold text-red-600">{stats.favorites}</p>
                </div>
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <Star className="h-4 w-4 mr-1" />
                <span>Saved items</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History and Favorites */}
        <Tabs defaultValue="history" className="space-y-6 ">
          <TabsList>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activity
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
          </TabsList>
          <div className="w-full lg:w-[80%] mx-auto">
          <TabsContent value="history">
            <Card >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentHistory.length > 0 ? (
                  <ScrollArea className="h-[400px] border-none"> {/* Added ScrollArea here */}
                    <div className="space-y-4 pr-4 "> {/* Added pr-4 for scrollbar space */}
                      {recentHistory.map((item) => (
                        <div key={item.id} className="flex items-start gap-4 p-4  rounded-lg hover:bg-gray-50">
                          <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.type}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatDate(item.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 truncate">
                              {item.input || item.content || "AI interaction"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity yet</p>
                    <p className="text-sm">Start using AI features to see your history here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Saved Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <ScrollArea className="border-none h-[400px]"> {/* Added ScrollArea here */}
                    <div className="space-y-4 pr-4"> {/* Added pr-4 for scrollbar space */}
                      {favorites.map((item) => (
                        <div key={item.id} className="flex items-start gap-4 p-4  rounded-lg hover:bg-gray-50">
                          <div className="p-2 rounded-lg bg-red-100 text-red-700">
                            <Heart className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.type}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatDate(item.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 line-clamp-2">
                              {item.content?.substring(0, 150)}...
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No favorites saved yet</p>
                    <p className="text-sm">Save your favorite AI responses to see them here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          </div>
        </Tabs>

        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => {
            localStorage.removeItem("chatHistory");
            localStorage.removeItem("contentHistory");
            localStorage.removeItem("codeHistory");
            localStorage.removeItem("favorites");
            window.location.reload(); // Refresh to reflect changes
          }}
        >
          Clear All History & Favorites
        </Button>
        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-16 flex flex-col gap-2" variant="outline" asChild>
                <a href="/chat">
                  <MessageSquare className="h-6 w-6" />
                  <span>Start New Chat</span>
                </a>
              </Button>

              <Button className="h-16 flex flex-col gap-2" variant="outline" asChild>
                <a href="/summarizer">
                  <FileText className="h-6 w-6" />
                  <span>Generate Content</span>
                </a>
              </Button>

              <Button className="h-16 flex flex-col gap-2" variant="outline" asChild>
                <a href="/code-helper">
                  <Code className="h-6 w-6" />
                  <span>Analyze Code</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
