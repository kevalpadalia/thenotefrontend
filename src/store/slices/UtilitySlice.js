import { createSlice } from "@reduxjs/toolkit";
const api = "http://localhost:4000/api/"
const socketApi="http://localhost:4000"
const utilitySlice = createSlice({
    name: "utility",
    initialState: {},
    reducers: {
        utilities(state, action) {
            state['config'] = action && action.payload && action.payload.config ? action.payload.config : ''
            state['api'] = api
            state['socketApi'] = socketApi
        },
        jwt(state, action) {
            const newToken = action.payload;
            return { ...state, jwt: newToken };
        },
        varient(state, action) {
            state['navVarient'] = action.payload.navVarient
        },
        currentProject(state, action) {
            state['currentProject'] = action && action.payload ?action.payload:{}
        }
    }
})

export default utilitySlice.reducer;
export const { utilities,jwt,varient,currentProject} = utilitySlice.actions
