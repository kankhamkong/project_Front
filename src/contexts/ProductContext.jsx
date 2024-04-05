/* eslint-disable react/prop-types */
import axios from 'axios'
import {createContext, useState, useEffect} from 'react'

const ProductContext = createContext()

function ProductContextProvider(props) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect( ()=>{
    const run = async () => {
      try {
        setLoading(true)
        let token = localStorage.getItem('token')
        if(!token) { return }
        const rs = await axios.get('http://localhost:8889/book/book', {
          headers : { Authorization : `Bearer ${token}` }
        })
        setProduct(rs.data.Book)
        // console.log(rs.data.Book)
      }catch(err) {
        console.log(err.message)
      }finally {
        setLoading(false)
      }   
    }
    run()
  }, [])

  const addbook = async (input) => {
        try {
          setLoading(true)
          let token = localStorage.getItem('token')
          if(!token) { return }
          const rs = await axios.post('http://localhost:8889/book/add', input, {
            headers : { Authorization : `Bearer ${token}` }
          })
          setProduct(rs.data.Book)
          console.log(rs.data.Book)
        }catch(err) {
          console.log(err.message)
        }finally {
          setLoading(false)
        }   
      }

  return (
    <ProductContext.Provider value={ {product,loading,addbook } }>
      {props.children}
    </ProductContext.Provider>
  )
}

export { ProductContextProvider }
export default ProductContext