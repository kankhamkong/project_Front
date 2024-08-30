import axios from "axios";
import { createContext, useState, useEffect } from "react";

const ProductContext = createContext();

function ProductContextProvider(props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshProduct, setRefreshProduct] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        const response = await axios.get("http://localhost:8889/book/book", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.Book);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [refreshProduct]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`http://localhost:8889/book/book/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        alert("Delete success");
        setRefreshProduct((prev) => !prev);
      }
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const addBook = async (input) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const response = await axios.post("http://localhost:8889/book/add", input, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.Book);
      setRefreshProduct((prev) => !prev);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Updetabook = async (input) => {
    try{
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const response = await axios.put(`http://localhost:8889/book/${input.id}`, input, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setProducts(response.data.Book);
      setRefreshProduct((prev) => !prev);
      console.log(refreshProduct)
    }catch (err){
      console.log(err.message);
    }
  }

  return (
    <ProductContext.Provider value={{ products, loading, addBook, handleDelete,setRefreshProduct,Updetabook }}>
      {props.children}
    </ProductContext.Provider>
  );
}

export { ProductContextProvider };
export default ProductContext;
