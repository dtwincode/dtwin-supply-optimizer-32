
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, ChartBar, FileText, Send, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const outputFormats = [
  { id: "text", name: "Text Response" },
  { id: "chart", name: "Chart Visualization" },
  { id: "report", name: "Detailed Report" },
];

// Context about the application to provide to the AI
const appContext = `
This is dtwin, a cloud-based demand-driven supply chain planning platform. It helps optimize inventory, 
improve forecasting accuracy, and enhance supply chain resilience using Demand-Driven Material 
Requirements Planning (DDMRP) principles. The platform integrates real-time data, AI analytics, 
and automation for efficient supply chain execution.

Key features:
- Inventory optimization and management
- Demand forecasting with accuracy metrics
- Supply chain visibility and resilience tools
- Distribution planning and analysis
- Lead time tracking and optimization
- Buffer management based on DDMRP principles
- What-if scenario planning

Current dashboard metrics include:
- Forecast accuracy (85% overall)
- Inventory turnover ratio (4.2)
- Average lead times (14 days)
- On-time delivery rate (92%)
- Buffer status (35% green, 45% yellow, 20% red)
- Service level (95%)

Available data in the system:
- Historical sales data for the past 24 months
- Current inventory levels across all locations
- Lead time data for all suppliers
- Demand forecasts for the next 12 months
- Buffer profiles and configurations
- Product hierarchy and classifications
- Distribution network information

The user is a demand planner looking to analyze and optimize their supply chain.
`;

export const AskAI = () => {
  const [query, setQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("text");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    const userMessage: Message = {
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log('Calling Supabase function with query:', query);
      
      // Use a direct fetch to the edge function with anonymous access
      const functionUrl = 'https://mttzjxktvbsixjaqiuxq.supabase.co/functions/v1/process-ai-query';
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHpqeGt0dmJzaXhqYXFpdXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNjk4NDEsImV4cCI6MjA1NDc0NTg0MX0.-6wiezDQfeFz3ecyuHP4A6QkcRRxBG4j8pxyAp7hkx8'
        },
        body: JSON.stringify({ 
          prompt: query,
          context: appContext,
          format: selectedFormat,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || `Error ${response.status}: ${response.statusText}`;
        } catch (e) {
          errorMessage = `Error ${response.status}: ${errorText || response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Response received:', data);

      if (!data.generatedText) {
        throw new Error('No response received from AI');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.generatedText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setQuery("");
      
      toast({
        title: "Success",
        description: "Response received successfully",
      });
    } catch (error: any) {
      console.error('Error processing query:', error);
      setError(error.message || "Failed to process your query. Please try again.");
      toast({
        title: "Error",
        description: error.message || "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleRetry = () => {
    setError(null);
    setMessages([]);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">Ask AI Assistant</h2>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-muted mr-4'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {messages.length === 0 && !error && (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Ask anything about your supply chain data</p>
                  <p className="text-sm mt-2">
                    Examples: "What products have the highest demand variability?", 
                    "Analyze my forecast accuracy trends", 
                    "Which products have the longest lead times?"
                  </p>
                </div>
              </div>
            )}
            {error && messages.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error connecting to AI assistant</AlertTitle>
                  <AlertDescription>
                    <p className="mb-4">{error}</p>
                    <Button variant="outline" size="sm" onClick={handleRetry} className="mt-2">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            {error && messages.length > 0 && (
              <div className="flex justify-center my-4">
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <Select onValueChange={setSelectedFormat} value={selectedFormat}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent>
                  {outputFormats.map((format) => (
                    <SelectItem key={format.id} value={format.id}>
                      {format.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {messages.length > 0 && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChartBar className="h-4 w-4 mr-2" />
                    Chart
                  </Button>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Textarea
                placeholder="Ask anything about your supply chain data..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-[80px]"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || !query.trim()}
                className="px-4"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Processing</span>
                  </div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
