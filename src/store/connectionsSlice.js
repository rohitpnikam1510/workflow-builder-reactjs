// src/store/connectionsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const connectionsSlice = createSlice({
    name: 'connections',
    initialState: [],
    reducers: {
        addConnection: (state, action) => {
            state.push(action.payload);
        },
        removeConnection: (state, action) => {
            return state.filter(
                (connection) =>
                    connection.source !== action.payload.source ||
                    connection.target !== action.payload.target
            );
        },
        clearConnections: () => [],
    },
});

export const { addConnection, removeConnection, clearConnections } = connectionsSlice.actions;
export default connectionsSlice.reducer;