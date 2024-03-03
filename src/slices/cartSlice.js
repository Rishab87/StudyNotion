import {createSlice } from "@reduxjs/toolkit"
import { Toast } from "react-hot-toast"

const initialState ={
    totalItems: localStorage.getItem("total-items")? JSON.parse(localStorage.getItem('total-items')): 0
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        setTotalItems(state){
            state.totalItems++;
        }
        //add to cart
        //remove from cart
        //reset cart
    }
})

export const {setTotalItems} = cartSlice.actions
export default cartSlice.reducer;