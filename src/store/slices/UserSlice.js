import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {},
    reducers: {
        loginUser(state, action) {
            state['user'] = action.payload
        }
    }
})

export default userSlice.reducer;
export const { loginUser} = userSlice.actions