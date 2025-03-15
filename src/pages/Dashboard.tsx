
import React, { useEffect } from 'react';
import DashboardLayout from "@/components/DashboardLayout";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import ModuleSummaryCards from "@/components/dashboard/ModuleSummaryCards";
import FinancialMetrics from "@/components/dashboard/FinancialMetrics";
import SustainabilityMetrics from "@/components/dashboard/SustainabilityMetrics";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container px-6 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <DashboardMetrics />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DashboardCharts />
        </div>
        
        <div className="mb-6">
          <ModuleSummaryCards />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FinancialMetrics />
          <SustainabilityMetrics />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
