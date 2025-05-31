import { Switch, Route } from "wouter";
import { CartProvider } from "./lib/cart-context";
import Home from "./pages/home";
import Orders from "./pages/orders";
import NotFound from "./pages/not-found";
import Cart from "./components/cart";
import TestOrder from "./components/test-order";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <CartProvider>
          <div className="relative">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/orders" component={Orders} />
              <Route component={NotFound} />
            </Switch>
            <Cart />
            {process.env.NODE_ENV === 'development' && <TestOrder />}
          </div>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;