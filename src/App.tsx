import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import Layout from "./components/Layout";

export default function App() {
  const [search, setSearch] = useState("");

  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <Layout search={search} setSearch={setSearch} />
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
