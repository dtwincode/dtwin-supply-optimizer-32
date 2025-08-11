
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, User, AlertCircle, Tag } from "lucide-react";
import { getPriorityColor, getTypeIcon } from "@/utils/ticketUtils";
import { type Ticket } from "@/types/tickets";

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const TypeIcon = () => {
    switch (ticket.type) {
      case "technical":
        return <AlertCircle className="h-4 w-4" />;
      case "task":
        return <Tag className="h-4 w-4" />;
      case "advice":
        return <User className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold">{ticket.title}</h3>
          <p className="text-sm text-muted-foreground">
            {ticket.description}
          </p>
        </div>
        <Badge variant={getPriorityColor(ticket.priority)}>
          {ticket.priority}
        </Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>{ticket.assignedTo}</span>
        </div>
        <div className="flex items-center gap-1">
          <TypeIcon />
          <span>{ticket.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{ticket.status}</span>
        </div>
        {ticket.department && (
          <span>Department: {ticket.department}</span>
        )}
        {ticket.dueDate && (
          <span>Due: {new Date(ticket.dueDate).toLocaleDateString()}</span>
        )}
      </div>
    </Card>
  );
};
