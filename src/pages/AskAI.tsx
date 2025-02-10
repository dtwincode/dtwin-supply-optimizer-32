
import DashboardLayout from "@/components/DashboardLayout";
import { AskAI } from "@/components/ai/AskAI";

const AskAIPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">AI Assistant</h1>
            <p className="text-muted-foreground">
              Ask questions and get insights about your supply chain data
            </p>
          </div>
        </div>
        <AskAI />
      </div>
    </DashboardLayout>
  );
};

export default AskAIPage;
