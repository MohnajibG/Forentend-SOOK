// src/App.tsx
import { useState } from "react";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { BrowserRouter as Router } from "react-router-dom";

import Layout from "./components/Layout";

function App() {
  const [search, setSearch] = useState<string>("");

  return (
    <UserProvider>
      <CartProvider>
        <Router>
          {/* Layout s’occupe de Header + Routes + Footer */}
          <Layout search={search} setSearch={setSearch} />
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
