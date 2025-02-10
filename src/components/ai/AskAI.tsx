
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, ChartBar, FileText } from "lucide-react";

const outputFormats = [
  { id: "text", name: "Text Response" },
  { id: "chart", name: "Chart Visualization" },
  { id: "report", name: "Detailed Report" },
];

export const AskAI = () => {
  const [query, setQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("text");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    try {
      const response = await fetch('https://mttzjxktvbsixjaqiuxq.functions.supabase.co/process-ai-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          context: "Supply chain management system with inventory, sales, marketing, and logistics data. The user is looking for insights and analysis based on the available data.",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process query');
      }

      const data = await response.json();
      setResponse(data.response);
      
      toast({
        title: "Success",
        description: "Query processed successfully",
      });
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format: string) => {
    toast({
      title: "Download Started",
      description: `Downloading response in ${format} format`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <h2 className="text-lg font-medium">Ask AI Assistant</h2>
          </div>
          <Textarea
            placeholder="Ask anything about your supply chain data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px]"
          />
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
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Processing..." : "Submit Query"}
            </Button>
          </div>
        </div>
      </Card>

      {response && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Response</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload('pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload('excel')}>
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload('chart')}>
                  <ChartBar className="h-4 w-4 mr-2" />
                  Chart
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
