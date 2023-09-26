import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProductForm from "./pages/ProductForm";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import NoPageFound from "./pages/NoPageFound";
import UpdateForm from "./pages/UpdateForm";

function App() {
  interface IProduct {
    _id: string;
    title: string;
    description: string;
    owner: {
      [key: string]: any;
    };
    date: Date;
    countryPricing: any[];
    
  }

  const [user, setUser] = useState<any>();
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    // make sure user is still logged in
    if (localStorage.getItem("user")) {
      setUser(localStorage.getItem("user"));
    }

    axios
      .get("/api/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <BrowserRouter>
      <header>
        <Nav user={user} setUser={setUser} />
      </header>
      <Routes>
        {/* Pages  */}
        <Route path="/" element={<Home user={user} products={products} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/create"
          element={<ProductForm products={products} setProducts={setProducts} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard products={products} setProducts={setProducts} />}
        />
        {/* products  */}
        {products.map((product) => (
          <Route
            key={product._id}
            path={`/products/${product._id}`}
            element={<Product {...product} user={user} />}
          />
        ))}
        {products.map((product) => (
          <Route
            key={product._id}
            path={`/products/${product._id}/update`}
            element={<UpdateForm {...product} setProducts={setProducts} />}
          />
        ))}
        {/* No page found */}
        <Route path="*" element={<NoPageFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
