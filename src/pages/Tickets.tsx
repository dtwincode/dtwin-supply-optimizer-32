
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, PlusCircle, Tag, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Improved type definitions with proper documentation
type TicketPriority = "high" | "medium" | "low";
type TicketType = "technical" | "task" | "advice";
type TicketStatus = "open" | "in-progress" | "resolved";

interface Ticket {
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

const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "System Performance Issue",
    description: "Experiencing slow response times in the planning module",
    priority: "high",
    type: "technical",
    status: "open",
    assignedTo: "IT Support",
    createdAt: new Date().toISOString(),
    department: "Planning",
    tags: ["performance", "urgent"],
  }
];

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTicket: Ticket = {
      id: (tickets.length + 1).toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as TicketPriority,
      type: formData.get("type") as TicketType,
      status: "open",
      assignedTo: formData.get("assignedTo") as string,
      createdAt: new Date().toISOString(),
      department: formData.get("department") as string,
      dueDate: formData.get("dueDate") as string || undefined,
    };

    setTickets([...tickets, newTicket]);
    setIsDialogOpen(false);

    // Enhanced toast notification with more context
    toast({
      title: "Ticket Created Successfully",
      description: `Ticket "${newTicket.title}" has been assigned to ${newTicket.assignedTo}`,
    });

    // Here you would typically trigger email notifications
    // This would be handled by your backend service
    console.log("Email notification would be sent to:", newTicket.assignedTo);
    if (newTicket.type === "task") {
      console.log("Task assignment email to be sent");
    } else if (newTicket.priority === "high") {
      console.log("High priority notification to be sent to leadership");
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
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

  const getTypeIcon = (type: TicketType) => {
    switch (type) {
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
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
            <p className="text-muted-foreground">
              Manage technical issues, tasks, and requests
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Ticket</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="task">Task Assignment</SelectItem>
                        <SelectItem value="advice">Request Advice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" name="department" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" name="dueDate" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Input id="assignedTo" name="assignedTo" required />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="submit">Create Ticket</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="p-6">
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
                  {getTypeIcon(ticket.type)}
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
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketsPage;
