
export type TicketPriority = "high" | "medium" | "low";
export type TicketType = "technical" | "task" | "advice";
export type TicketStatus = "open" | "in-progress" | "resolved";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  type: TicketType;
  status: TicketStatus;
  assignedTo: string;
  createdAt: string;
  department?: string;
  dueDate?: string;
  tags?: string[];
}
