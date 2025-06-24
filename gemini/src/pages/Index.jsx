// This component should be saved as Index.jsx or Index.js
// Make sure you have the necessary dependencies installed:
// - react
// - react-router-dom
// - lucide-react
// - @/components/ui/button (from shadcn/ui or similar)
// - @/components/ui/card (from shadcn/ui or similar)

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, MessageSquare, FileText, Code, BarChart3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom"; // Don't forget to install react-router-dom

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-2"> {/* Outer wrapper for gray margin */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden shadow-md"> {/* Inner content */}
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm rounded-t-2xl overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold">AI Assistant Pro</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="primary" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center w-full">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Assistant </span>
              for Everything
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Chat with AI, summarize content, analyze code, and boost your productivity with Google Gemini AI
            </p>
            <Button
              size="lg"
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-md transition"
              asChild
            >
              <Link to="/register" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Start for Free
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-center mb-12">Powerful AI Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Smart Chat</CardTitle>
                <CardDescription>
                  Intelligent conversations with AI assistant powered by Google Gemini
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <FileText className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Content Tools</CardTitle>
                <CardDescription>
                  Summarize articles, generate blogs, create social media content
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <Code className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Code Helper</CardTitle>
                <CardDescription>
                  Explain, optimize, and debug your code with AI assistance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>
                  Track usage, save favorites, and manage your AI interactions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 rounded-b-2xl ">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to supercharge your productivity?</h3>
            <p className="text-xl mb-8 opacity-90">Join thousands of users leveraging AI for better results</p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Get Started Now</Link>
            </Button>
          </div>
        </section>

      </div> {/* End of inner content */}
    </div>  /* End of gray background wrapper */
  );
};

export default Index;