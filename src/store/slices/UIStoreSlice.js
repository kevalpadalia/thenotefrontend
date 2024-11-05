import { createSlice } from "@reduxjs/toolkit";
const uiStoreSlice = createSlice({
    name: "helper",
    initialState: {},
    reducers: {
        uiStore(state, action) {
            const { type, data, msg } = action.payload;
            switch (type) {
                 case "users":
                    state.users = data || [];
                    break;
                 case "projects":
                    state.projects = data || [];
                    break;
                case "error":
                    state.error = msg || null;
                    break;
                case "clearError":
                    state.error = null;
                    break;
                default:
                    break;
            }
        },
    }
})

export default uiStoreSlice.reducer;
export const { uiStore } = uiStoreSlice.actions
