import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'ecom_cart'

const initialState = {
  items: JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [],
}

const cartReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.items.findIndex(item => item._id === action.payload._id)
      if (existingIndex >= 0) {
        const updatedItems = [...state.items]
        updatedItems[existingIndex].quantity += action.payload.quantity || 1
        newState = { ...state, items: updatedItems }
      } else {
        newState = { ...state, items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }] }
      }
      break;
    }
    case 'REMOVE_FROM_CART': {
      newState = {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      }
      break;
    }
    case 'UPDATE_QUANTITY': {
      newState = {
        ...state,
        items: state.items.map(item => 
          item._id === action.payload.id 
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
      break;
    }
    case 'CLEAR_CART': {
      newState = { ...state, items: [] }
      break;
    }
    default:
      return state
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState.items))
  return newState
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } })
  }

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider 
      value={{ 
        cart: state.items, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        dispatch 
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
