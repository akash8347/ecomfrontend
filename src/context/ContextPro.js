import { createContext, useEffect, useReducer } from "react";

export const cartContext = createContext();

export const myreducer = (state, action) => {
    let cart;
    switch (action.type) {
        case "INCREMENT":
            cart = [...state.cart, { ...action.playload, quantity: 1 }];
            
            const cartTotalIncremented = state.cartTotal + parseFloat(action.playload.price);
            localStorage.setItem("cart", JSON.stringify(cart));
            localStorage.setItem("cartTotal", JSON.stringify(cartTotalIncremented));
            return {
                ...state,
                cart,
                cartTotal: cartTotalIncremented,
            };

        case "DECREMENT":
            cart = state.cart.filter((item) => item.id !== action.playload.id);
            const cartTotalDecremented = state.cartTotal - parseFloat(action.playload.price);
            localStorage.setItem("cart", JSON.stringify(cart));
            localStorage.setItem("cartTotal", JSON.stringify(cartTotalDecremented));
            return {
                ...state,
                cart,
                cartTotal: cartTotalDecremented,
            };
        case "SINGLE_CART_REMOVE":
            const removedItem = action.playload;
            const updatedCart = state.cart.filter((item) => item.id !== removedItem.id);
            return {
                ...state,
                cart: updatedCart,
                cartTotal: state.cartTotal - (parseFloat(removedItem.price) * removedItem.quantity)
            }
        case "INCREASE_QUANTITY":
            const index = state.cart.findIndex((c) => c.id === action.playload);
            const newCart = [...state.cart];
            newCart[index].quantity += 1;
            return {
                ...state, cart: newCart, cartTotal: state.cartTotal + parseFloat(newCart[index].price)
            }

        case "DECREASE_QUANTITY":
            const idx = state.cart.findIndex((c) => c.id === action.playload)
            const newCart1 = [...state.cart];
            newCart1[idx].quantity -= 1;
            return {
                ...state, cart: newCart1, cartTotal: state.cartTotal - parseFloat(newCart1[idx].price)
            }
        case 'SHIPPING_DETAIL':
            return {
                ...state, shippingdata: action.payload
            }
        case 'ADD_ORDER':
            return {
                ...state, useOrder: action.payload
            }
        case 'LOGOUT_ORDER':
            return {
                ...state, useOrder: null
            }
        case 'SET_PRODUCTS':
            return {
                ...state, proData: action.payload
            }
        default:
            return state;
    }
}

export const ContextPro = ({ children }) => {
    const initState = {
        proData: [],
        cart: JSON.parse(localStorage.getItem("cart")) || [],
        cartTotal: JSON.parse(localStorage.getItem("cartTotal")) || 0,
        shippingdata: {},
        useOrder: []
    }
    const [state, dispatch] = useReducer(myreducer, initState)

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("cartTotal", JSON.stringify(state.cartTotal));
    }, [state.cart, state.cartTotal]);

    return (
        <cartContext.Provider value={{ state, dispatch }}>
            {children}
        </cartContext.Provider>
    );
}


