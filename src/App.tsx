
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { ProductHierarchyUpload } from "./components/settings/product-hierarchy/ProductHierarchyUpload";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <ProductHierarchyUpload />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
