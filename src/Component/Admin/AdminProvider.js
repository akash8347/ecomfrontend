import { createContext, useReducer } from "react";

export const adminContext = createContext();



export const adminReducer = (state, action) => {
    switch (action.type) {
        case 'ALLORDERS':
            console.log(action.payload)
            return {
                ...state, allorders: action.payload
            }
        case 'ALLUSERS':
            return {
                ...state, allusers: action.payload
            }
        case 'UPDATE_ORDER_STATUS':
            // Find the index of the order in the state array
            const orderIndex = state.allorders.findIndex(order => order.order_id === action.payload.orderId);
            if (orderIndex === -1) {
                return state; // Order not found in state, return original state
            }
            // Create a new copy of the order object with the updated status
            const updatedOrder = {
                ...state.allorders[orderIndex],
                order_status: action.payload.status
            };
            // Create a new copy of the state array with the updated order object
            const updatedOrders = [
                ...state.allorders.slice(0, orderIndex),
                updatedOrder,
                ...state.allorders.slice(orderIndex + 1)
            ];
            // Return a new state object with the updated orders array
            return { ...state, allorders: updatedOrders };
        case 'TOTAL_USER':
            return {
                ...state, totalUsers: action.payload
            }
        case 'TOTAL_INCOME':
            return {
                ...state, totalIncome: action.payload
            }
        case 'DELETE_ORDER':
            const deletedOrderId = action.payload;
            // Filter out the deleted order from the allorders array
            const updatedOrders1 = state.allorders.filter(order => order.id !== deletedOrderId);
            return { ...state, allorders: updatedOrders1 };
        case 'DELETE_USER':
            const deletedUserId = action.payload;
            const updatedUsers1 = state.allusers.filter(user => user.id !== deletedUserId);
            return { ...state, allusers: updatedUsers1 };
        case 'DELETE_PRODUCT':
            const deletedProductId = action.payload;
            const updatedProducts1 = state.allProducts.filter(order => order.id !== deletedProductId);


            return {
                ...state, allProducts: updatedProducts1
            }
        case 'ALL_PRODUCTS':
            return {
                ...state, allProducts: action.payload
            }
        default:
            return state;

    }

}
export const AdminProvider = ({ children }) => {
    const initState = {
        allorders: [],
        allusers: [],
        totalUsers: 0,
        totalIncome: 0,
        allProducts: []
    }
    const [state, dispatch] = useReducer(adminReducer, initState)
    console.log(state.allorders)

    return (
        <adminContext.Provider value={{ ...state, dispatch }}>
            {children}
        </adminContext.Provider>
    );
}


