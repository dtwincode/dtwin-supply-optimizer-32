
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mountTime] = useState(new Date().toISOString());
  
  useEffect(() => {
    // Comprehensive error logging for routing problems
    console.error(
      "404 Error: Route not found:", 
      {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        state: location.state,
        key: location.key,
        mountTime: mountTime,
        userAgent: navigator.userAgent,
        referrer: document.referrer || "Not available",
        fullUrl: window.location.href
      }
    );
    
    // Log available routes for debugging
    console.log("404 Page - Available routes:", [
      "/", "/auth", "/ddsop", "/forecasting", "/inventory", 
      "/supply-planning", "/sales-and-returns", "/marketing", 
      "/logistics", "/reports", "/ask-ai", "/data", 
      "/guidelines", "/sql-config", "/tickets"
    ]);
  }, [location, mountTime]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">
            Oops! We couldn't find the page you're looking for.
          </p>
          <p className="text-gray-500 mb-8">
            The page at <span className="font-mono bg-gray-100 p-1 rounded">{location.pathname}</span> doesn't exist or may have been moved.
          </p>
          <div className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full flex items-center justify-center">
                <Home className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </Link>
            <Button variant="outline" className="w-full flex items-center justify-center" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Link to="/data" className="block">
              <Button variant="outline" className="w-full">Go to Data Management</Button>
            </Link>
            <div className="mt-4 p-4 bg-gray-100 rounded text-left text-xs">
              <p className="font-bold">Debug Info:</p>
              <p>Pathname: {location.pathname}</p>
              <p>Search: {location.search}</p>
              <p>Full URL: {window.location.href}</p>
              <p>Previous Page: {document.referrer || "Not available"}</p>
              <p>Timestamp: {new Date().toISOString()}</p>
              <p>Mount Time: {mountTime}</p>
              <p>User Agent: {navigator.userAgent}</p>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default NotFound;
