import React, { useCallback, useState } from 'react';
import  {
    ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from '@xyflow/react';

const WorkflowCanvas = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      const position = {
        x: event.clientX,
        y: event.clientY,
      };
      const newNode = {
        id: `${nodeType}-${nodes.length}`,
        type: nodeType,
        position,
        data: { label: `${nodeType} Node` },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [nodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="h-full w-full border rounded-lg" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={setEdges}
        onNodesChange={setNodes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
    </ReactFlow>    
    </div>
  );
};

export default WorkflowCanvas;