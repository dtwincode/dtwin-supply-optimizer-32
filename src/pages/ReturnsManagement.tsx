
import { Navigate } from "react-router-dom";

// This page is now deprecated in favor of the combined SalesAndReturns page
const ReturnsManagementPage = () => {
  return <Navigate to="/sales-and-returns?tab=returns" replace />;
};

export default ReturnsManagementPage;
