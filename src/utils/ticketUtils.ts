
import { type TicketPriority, type TicketType } from "@/types/tickets";

export const getPriorityColor = (priority: TicketPriority) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "default";
    default:
      return "default";
  }
};

export const getTypeIcon = (type: TicketType) => {
  switch (type) {
    case "technical":
      return "alert-circle";
    case "task":
      return "tag";
    case "advice":
      return "user";
    default:
      return "tag";
  }
};
