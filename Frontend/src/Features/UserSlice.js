import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        user:null
    },
    reducers:{
        AuthUser:(state,action)=>{
           state.user=action.payload;
        },
        LogoutUser: (state) => {
      state.user = null; // clears Redux state
    }
    }
})

export const {AuthUser,LogoutUser }=userSlice.actions;
export default userSlice.reducer;