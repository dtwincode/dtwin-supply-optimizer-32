
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, ChartBar, FileText, Send, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      
      const { data, error } = await supabase.functions.invoke('process-ai-query', {
        body: JSON.stringify({ prompt: query }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response received:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function error: ${error.message || 'Unknown error'}`);
      }

      if (data?.error) {
        console.error('Error in AI response:', data.error);
        throw new Error(data.error);
      }

      if (!data?.generatedText) {
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
              <div className="flex items-center justify-center h-64 text-destructive">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-70" />
                  <p className="text-lg font-medium">Error connecting to AI assistant</p>
                  <p className="text-sm mt-2 max-w-md mx-auto">{error}</p>
                  <p className="text-xs mt-4 text-muted-foreground">
                    Please ensure the OpenAI API key is correctly configured
                  </p>
                </div>
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
