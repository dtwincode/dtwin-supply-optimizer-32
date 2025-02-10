
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CreateTicketDialog } from "@/components/tickets/CreateTicketDialog";
import { TicketCard } from "@/components/tickets/TicketCard";
import { type Ticket } from "@/types/tickets";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  },
  // Adding more mock tickets to demonstrate scrolling
  {
    id: "2",
    title: "Database Connection Error",
    description: "Users unable to connect to the main database",
    priority: "high",
    type: "technical",
    status: "open",
    assignedTo: "IT Support",
    createdAt: new Date().toISOString(),
    department: "IT",
    tags: ["database", "urgent"],
  },
  {
    id: "3",
    title: "Update Documentation",
    description: "Need to update user documentation for new features",
    priority: "medium",
    type: "task",
    status: "open",
    assignedTo: "documentation@example.com",
    createdAt: new Date().toISOString(),
    department: "Documentation",
    tags: ["documentation"],
  },
  {
    id: "4",
    title: "Server Maintenance",
    description: "Scheduled server maintenance and updates",
    priority: "low",
    type: "task",
    status: "open",
    assignedTo: "operations@example.com",
    createdAt: new Date().toISOString(),
    department: "Operations",
    tags: ["maintenance"],
  }
];

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateTicket = (newTicketData: Omit<Ticket, "id" | "status" | "createdAt">) => {
    const newTicket: Ticket = {
      ...newTicketData,
      id: (tickets.length + 1).toString(),
      status: "open",
      createdAt: new Date().toISOString(),
    };

    setTickets([...tickets, newTicket]);
    setIsDialogOpen(false);

    toast({
      title: "Ticket Created Successfully",
      description: `Ticket "${newTicket.title}" has been assigned to ${newTicket.assignedTo}`,
    });

    console.log("Email notification would be sent to:", newTicket.assignedTo);
    if (newTicket.type === "task") {
      console.log("Task assignment email to be sent");
    } else if (newTicket.priority === "high") {
      console.log("High priority notification to be sent to leadership");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
              <p className="text-muted-foreground">
                Manage technical issues, tasks, and requests
              </p>
            </div>
            <CreateTicketDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onSubmit={handleCreateTicket}
            />
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)] border rounded-md">
            <div className="p-4">
              <div className="grid gap-4">
                {tickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketsPage;
