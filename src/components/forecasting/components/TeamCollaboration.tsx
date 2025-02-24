
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Share2, Send } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export const TeamCollaboration = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: "John Doe",
      text: "Noticed an unusual spike in the forecast. Could be due to seasonal factors.",
      timestamp: "2024-03-20T10:00:00Z"
    },
    {
      id: "2",
      user: "Jane Smith",
      text: "Agreed. Let's adjust the seasonality parameters.",
      timestamp: "2024-03-20T10:30:00Z"
    }
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      user: "Current User",
      text: newComment,
      timestamp: new Date().toISOString()
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment("");
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    toast.success("Analysis shared successfully");
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Team Collaboration</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Analysis
          </Button>
        </div>
        
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-4">
            {comments.map(comment => (
              <div 
                key={comment.id}
                className="flex items-start gap-3 p-3 bg-muted rounded-lg"
              >
                <MessageSquare className="h-4 w-4 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{comment.user}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <Button onClick={handleAddComment}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
