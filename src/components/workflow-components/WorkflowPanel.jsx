import React, { useRef, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { DnDProvider, useDnD } from './DnDContext';
import NodesPanel from './NodesPanel';
import { addConnection } from '../../store/connectionsSlice';
import { clearSelectedNode, setSelectedNode } from '../../store/selectedNodeSlice';
import { useRFInstance } from '../../components/workflow-components/RFInstanceContext'; // Import the context
import FileInput from './custom-nodes/FileInput';
import FilterNode from './custom-nodes/FilterNode';
import SortNode from './custom-nodes/SortNode';
import GroupDataNode from './custom-nodes/GroupDataNode';
import MergeNode from './custom-nodes/MergeNode';
import SliceNode from './custom-nodes/SliceNode';
import { useErrorBoundary } from 'react-error-boundary';

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const dispatch = useDispatch();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const { type, name } = useDnD();
  const { setRfInstance } = useRFInstance();

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
    dispatch(addConnection(params)); // Dispatch the connection to Redux
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!type) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${name}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type]
  );

  const nodeTypes = {
    fileInput: FileInput,
    filter: FilterNode,
    sort: SortNode,
    grouparray: GroupDataNode,
    merge: MergeNode,
    slice: SliceNode,
  };

  const handleNodeClick = (event, node) => {
    dispatch(clearSelectedNode());
    setTimeout(() => {
      dispatch(setSelectedNode(node.id));
    }, 500);
  };

  return (
    <div className="dndflow flex w-full h-[100vh]">
      <NodesPanel />
      <div className="reactflow-wrapper flex-1 h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          style={{ backgroundColor: "#F7F9FB" }}
          nodeTypes={nodeTypes}
          onInit={setRfInstance} // Capture and store the rfInstance
          onNodeClick={handleNodeClick}
        >
          <MiniMap />
          <Controls style={{ left: 10, bottom: 10 }} />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

const WorkflowPanel = () => {

  return (
    <div className="w-full h-full flex">
      <ReactFlowProvider>
        <DnDProvider>
          <DnDFlow />
        </DnDProvider>
      </ReactFlowProvider>
    </div>
  );
};


export default WorkflowPanel;
