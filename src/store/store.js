// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import connectionsReducer from './connectionsSlice';
import selectedNodeReducer from './selectedNodeSlice';

const store = configureStore({
    reducer: {
        connections: connectionsReducer,
        selectedNode: selectedNodeReducer
    },
});

export default store;