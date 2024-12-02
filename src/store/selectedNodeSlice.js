// store/selectedNodeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const selectedNodeSlice = createSlice({
    name: 'selectedNode',
    initialState: {
        nodeId: null, // Initially, no node is selected
    },
    reducers: {
        setSelectedNode: (state, action) => {
            state.nodeId = action.payload; // Update selected node ID
        },
        clearSelectedNode: (state) => {
            state.nodeId = null; // Clear selected node
        },
    },
});

export const { setSelectedNode, clearSelectedNode } = selectedNodeSlice.actions;

export default selectedNodeSlice.reducer;
