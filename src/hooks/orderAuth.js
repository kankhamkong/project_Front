
import { useContext } from 'react'
import OrderContext from '../contexts/OrderContext'

export default function orderAuth() {
  return useContext(OrderContext)
}