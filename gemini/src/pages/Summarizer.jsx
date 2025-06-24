import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Sparkles, Copy, Heart, Loader2, Check } from "lucide-react"; // Import Check icon
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const Summarizer = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("summarize");
  const [copied, setCopied] = useState(false); // New state for copy button
  const [favorited, setFavorited] = useState(false); // New state for heart button
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to process",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setCopied(false); // Reset copied state on new generation
    setFavorited(false); // Reset favorited state on new generation

    try {
      const response = await fetch("http://localhost:3001/summarizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          type: activeTab,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error || "Failed to fetch from server");
      }

      const data = await response.json();
      setResult(data.aiResponse || "");

      // Save to local history
      const history = JSON.parse(localStorage.getItem("contentHistory") || "[]");
      history.push({
        id: Date.now(),
        type: activeTab,
        input: inputText,
        output: data.aiResponse,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("contentHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Error fetching from backend:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true); // Set copied state to true
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  const saveToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    favorites.push({
      id: Date.now(),
      type: activeTab,
      content: result,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("favorites", JSON.stringify(favorites));

    setFavorited(true); // Set favorited state to true
    toast({
      title: "Saved!",
      description: "Added to favorites",
    });
    setTimeout(() => setFavorited(false), 2000); // Reset favorited state after 2 seconds
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-green-600" />
            Content Tools
          </h1>
          <p className="text-gray-600 mt-2">
            Generate summaries, blogs, tweets, and captions with Gemini AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 ">
          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle>Input Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="summarize">Summary</TabsTrigger>
                  <TabsTrigger value="blog">Blog</TabsTrigger>
                  <TabsTrigger value="tweet">Tweet</TabsTrigger>
                  <TabsTrigger value="caption">Caption</TabsTrigger>
                </TabsList>

                <div className="mt-4">
                  <Textarea
                    placeholder="Paste your content here to generate..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[300px]"
                  />

                  <div className="flex justify-between items-center mt-4">
                    <Badge variant="secondary">{inputText.length} characters</Badge>
                    <Button onClick={handleGenerate} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Output */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Content</CardTitle>
                {result && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      disabled={copied} // Disable button when copied
                      className={copied ? "text-green-500" : ""} // Apply green color when copied
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={saveToFavorites}
                      disabled={favorited} // Disable button when favorited
                      className={favorited ? "text-red-500" : ""} // Apply red color when favorited
                    >
                      <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} /> {/* Fill heart when favorited */}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {result ? (
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                  {result}
                </pre>
              ) : (
                <div className="text-center text-gray-500 py-16">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generated content will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Summarizer;