import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {authService} from "../../services";


let initialState = {
    errors: null,
    loading: null
};
const forgotPassword = createAsyncThunk(
    "managerSlice/forgotPassword",
    async (email,thunkAPI ) => {
        try {
            const {data} = await authService.forgotPassword(email);

            return data;
        }catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)
const forgotPasswordPut = createAsyncThunk(
    "managerSlice/forgotPasswordPut",
    async ({token, password},thunkAPI ) => {

        try {
            const {data} = await authService.forgotPasswordPut(token, password);

            return data;
        }catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)
const addPasswordPut = createAsyncThunk(
    "managerSlice/addPasswordPut",
    async ({token, password},thunkAPI ) => {

        try {
            const {data} = await authService.addPasswordPut(token, password);

            return data;
        }catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)
const addPassword = createAsyncThunk(
    "managerSlice/addPassword",
    async (email,thunkAPI ) => {
        try {
            const {data} = await authService.addPassword(email);

            return data;
        }catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)
const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {}
})

const {reducer: authReducer} = authSlice;

const authAction = {
    forgotPassword,
    forgotPasswordPut,
    addPassword,
    addPasswordPut,
}
export {
    authReducer,
    authAction
}