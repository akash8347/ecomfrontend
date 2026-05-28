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
            const normalizedOrderId = String(action.payload.orderId);
            const orderIndex = state.allorders.findIndex(order => String(order.order_id || order.id) === normalizedOrderId);
            if (orderIndex === -1) {
                return state;
            }
            const prevStatus = state.allorders[orderIndex].order_status || state.allorders[orderIndex].orderStatus || 'Pending';
            const updatedOrder = {
                ...state.allorders[orderIndex],
                order_status: action.payload.status || prevStatus,
                orderStatus: action.payload.status || prevStatus
            };
            const updatedOrders = [
                ...state.allorders.slice(0, orderIndex),
                updatedOrder,
                ...state.allorders.slice(orderIndex + 1)
            ];
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
            const updatedOrders1 = state.allorders.filter(order => String(order.order_id || order.id) !== String(deletedOrderId));
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


