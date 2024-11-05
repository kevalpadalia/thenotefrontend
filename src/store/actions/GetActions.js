import axios from "axios";
import { uiStore } from "../slices/UIStoreSlice";
import { loginUser} from "../slices/UserSlice";

export const users = (api, config) => async (dispatch) => {
    try {
        let response = await axios.get(api + "accounts/get/all/users", config);
        dispatch(uiStore({ type: "users", data: response.data.users }));
    } catch (error) {
        dispatch(uiStore({ type: "error", msg: error.message }))
    }
};
export const projects = (api, config) => async (dispatch) => {
    try {
        let response = await axios.get(api + "projects/get/all/projects/me", config);
        dispatch(uiStore({ type: "projects", data: response.data.projects }));
    } catch (error) {
        dispatch(uiStore({ type: "error", msg: error.message }))
    }
};
export const loadUser = (api, config) => async (dispatch) => {
    try {
        let response = await axios.get(api + "accounts/get/user/details", config);
        let payload = null
        if (response.data) {
            payload = response.data.user
            payload['jwt'] = response.data.jwt
            payload['authenticated'] = true
        } else {
            payload['authenticated'] = false
        }
        dispatch(loginUser(payload));
    } catch (error) {
        dispatch(uiStore({ type: "error", msg: error.message }))
    }
};

export const dispatchAll = (api, config, toDispatch) => async (dispatch) => {
    if (toDispatch == 'all') {
        dispatch(users(api, config,))
        dispatch(projects(api, config,))
        dispatch(loadUser(api, config,))
    } else {
        dispatch(toDispatch)
    }
};
export const clearError = () => async (dispatch) => {
    dispatch(uiStore({ type: "clearError" }))
};
