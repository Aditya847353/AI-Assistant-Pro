import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Sparkles, Copy, Heart, Bug, Zap, BookOpen, Loader2, Check } from "lucide-react"; // Import Check icon
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const CodeHelper = () => {
  const [inputCode, setInputCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("explain");
  const [language, setLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false); // New state for copy button
  const [favorited, setFavorited] = useState(false); // New state for heart button
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!inputCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setCopied(false); // Reset copied state on new generation
    setFavorited(false); // Reset favorited state on new generation

    try {
      const response = await fetch("http://localhost:3001/code-helper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: inputCode,
          type: activeTab,
          language: language,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error || "Failed to fetch from backend");
      }

      const data = await response.json();
      setResult(data.aiResponse || "");

      // Save to history
      const history = JSON.parse(localStorage.getItem("codeHistory") || "[]");
      history.push({
        id: Date.now(),
        type: activeTab,
        language,
        input: inputCode,
        output: data.aiResponse,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("codeHistory", JSON.stringify(history));

    } catch (error) {
      console.error("Code analysis error:", error);
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
      description: "Analysis copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  const saveToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    favorites.push({
      id: Date.now(),
      type: activeTab, // Use activeTab for type to differentiate from general 'code'
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

  const languages = [
    "javascript", "typescript", "python", "java", "cpp", "csharp",
    "php", "ruby", "go", "rust", "swift", "kotlin"
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Code className="h-8 w-8 text-purple-600" />
            Code Helper
          </h1>
          <p className="text-gray-600 mt-2">
            Explain, optimize, and debug your code with Gemini AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Programming Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="explain" className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      Explain
                    </TabsTrigger>
                    <TabsTrigger value="optimize" className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Optimize
                    </TabsTrigger>
                    <TabsTrigger value="debug" className="flex items-center gap-1">
                      <Bug className="h-3 w-3" />
                      Debug
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Textarea
                  placeholder={`Paste your ${language} code here...`}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />

                <div className="flex justify-between items-center">
                  <Badge variant="secondary">
                    {inputCode.split('\n').length} lines • {inputCode.length} characters
                  </Badge>

                  <Button onClick={handleAnalyze} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {activeTab === "explain"
                          ? "Explain Code"
                          : activeTab === "optimize"
                          ? "Optimize Code"
                          : "Debug Code"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>AI Analysis</CardTitle>
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
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Code analysis will appear here</p>
                  <p className="text-sm mt-2">
                    Paste your code and click "{activeTab === "explain"
                      ? "Explain Code"
                      : activeTab === "optimize"
                      ? "Optimize Code"
                      : "Debug Code"}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CodeHelper;