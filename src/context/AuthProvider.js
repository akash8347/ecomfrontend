// import { createContext, useReducer } from "react";


// export const authContext=createContext();

// export const authReducer=(state,action)=>{
// switch(action.type){
//     case 'LOGIN':
//         return{
//       ...state,user:action.playload
//     }
// }
// }

// export const AuthProvider=( {children})=>{
// const initial={
//     user:null
// }


// const [state,dispatch]=useReducer(authReducer,initial)
// return (
//     <authContext.Provider value={{...state,dispatch}}>
//         {children}
//     </authContext.Provider>
// );


// }


import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

export const myreducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state, user: action.payload
            }
        case 'ADMIN_LOGIN':
            return {
                ...state, admin: action.payload
            }
        // case 'ADMIN_LOGOUT':
        //     return {
        //         ...state, admin: null
        //     }
        case 'ADMIN_LOGOUT':
            return {
                 admin: null
            }


        case 'LOGOUT':
            return {
                user: null
            }


        default:
            return state;
    }

}

export const AuthProvider = ({ children }) => {
    const initState = {
        user: null,
        admin: null
    }
    const [state, dispatch] = useReducer(myreducer, initState)
    console.log(state.admin)
    useEffect(() => {

        const user = JSON.parse(localStorage.getItem('user'))
        const admin = JSON.parse(localStorage.getItem('adminJWT'))
        //    console.log(jsonuser)
        console.log(admin)
        if (user) {
            dispatch({ type: 'LOGIN', payload: user })
        }
        if (admin) {
            console.log(admin)
            dispatch({ type: 'ADMIN_LOGIN', payload: admin })
        }
    }, [])


    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}











