import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    token: localStorage.getItem("token")? JSON.parse(localStorage.getItem('token')): null,
    signupData: false,
    loading: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setToken(state , value){
            state.token = value.payload;
        },
        setLoading(state , value){
            state.loading = value.payload;
        },
        setSignUpData(state , value){
            state.signupData = value.payload;
        }
    },
});

export const {setToken ,setLoading , setSignUpData} = authSlice.actions;
export default authSlice.reducer;