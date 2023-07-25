import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import {managerService} from "../../services";


let initialState = {
    managers: [],
    errors: null,
    loading: null
};

const getManagers = createAsyncThunk(
    "managerSlice/getManagers",
    async (_, thunkAPI)=>{
        try {
            const {data} = await managerService.getAll();
            return data;
        }catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);

        }
    }

)
const createManager = createAsyncThunk(
    "managerSlice/createManager",
    async ({...manager},thunkAPI ) => {
        try {
            const {data} = await managerService.create(manager);
            thunkAPI.dispatch(getManagers());

            return data;
        }catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)
const updateManager = createAsyncThunk(
    "managerSlice/updateManager",
    async ({id, manager},thunkAPI ) => {
        try {
            const {data} = await managerService.update(id, manager);
            thunkAPI.dispatch(getManagers());

            return data;
        }catch (e) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
)

const managerSlice = createSlice({
        name: "managerSlice",
        initialState,
        reducers: {},
        extraReducers: {
            [getManagers.fulfilled]: (state, action)=> {
                state.managers = action.payload
            }
        }
    },
)

const {reducer: managerReducer} = managerSlice;

const managerAction = {
    getManagers,
    createManager,
    updateManager,
}
export {
    managerReducer,
    managerAction
}