import React, { useState } from 'react'
import productAuth from '../hooks/productAuth'
import { Navigate } from 'react-router-dom';

export default function Updatebook() {
  const [book, setBook] = useState({
    title: "",
    author: "",
    price: "",
    volume: "",
    rate: "",
    image: "",
    category: ""
  });
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshProduct, setRefreshProduct] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }
        const response = await axios.get(`http://localhost:8889/book/book`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBook(response.data.Book);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const response = await axios.put(`http://localhost:8889/book/${id}`, book, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBook(response.data.Book);
      setRefreshProduct(!refreshProduct);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#592828] min-h-screen  pt-24 p-2">
      <div className='max-w-[60rem] mx-auto my-22 bg-white'>

      </div>
    </div>
  )
}
