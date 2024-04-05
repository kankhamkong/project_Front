import axios from 'axios'
import ProductContext from '../contexts/ProductContext';
import { useContext } from 'react';
import { useEffect, useState } from 'react'
import UserHome from './UserHome';

export default function Wedmanga() {
  const [todos, setTodos] = useState({})

  const hdlChange = (e) => {
    setTodos((prevTodos) => ({ ...prevTodos, [e.target.name]: e.target.value }));
  };
    

  const {product} = useContext(ProductContext)
  
  useEffect(() => {
    const run = async () => {
      let token = localStorage.getItem('token')
      const rs = await axios.get('http://localhost:8889/wed', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTodos(rs.data.todos)
    }
    run()
  }, [])

  return (
  <div>
       <div className='manga'>
      {product && product.map(item => (
        <UserHome key={item.id} product={item}/>
      ))}

    </div>
  </div>
  )
}