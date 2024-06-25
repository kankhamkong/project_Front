import {useContext} from 'react'
import CartContext from '../contexts/CartContext'


export default function cartAuth() {
  return useContext(CartContext)
}