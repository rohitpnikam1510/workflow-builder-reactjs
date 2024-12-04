import React from 'react';
import { useDnD } from './DnDContext';
import { NodeType } from '../../utils/nodeTypes';

const NodesPanel = () => {
  const { setType, setName } = useDnD();

  const onDragStart = (event, nodeType, nodeName) => {
    setType(nodeType);
    setName(nodeName)
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="surface-3 p-4 w-1/5 h-full">

      <div className="mb-6">
        <div
          className="surface-1 font-medium text-1 dndnode fileInput shadow-lg p-4 rounded-md cursor-pointer"
          onDragStart={(event) => onDragStart(event, 'fileInput', 'File')}
          draggable
        >
          + New
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-1 text-lg font-semibold mb-2 border-b-2">Input</h2>
      </div>
      <div className="space-y-4">
        {/* <div
          className="dndnode exampleData bg-saffron p-4 rounded-md cursor-pointer"
          onDragStart={(event) => onDragStart(event, 'exampleData', 'Example Data')}
          draggable
        >
          Demo Node
        </div> */}
        <div
          className="surface-1 font-medium text-1 shadow-lg dndnode fileInput p-4 rounded-md cursor-pointer"
          onDragStart={(event) => onDragStart(event, 'fileInput', 'File')}
          draggable
        >
          File
        </div>
      </div>

      {/* Select Node */}
      <div className="mb-6 mt-2">
        <h2 className="text-1 text-lg font-semibold mb-2 border-b-2">Transform Node</h2>
        <div className="space-y-4">
          {NodeType.map((node) => (
            <div
              key={node.id}
              className="surface-1 font-medium text-1 shadow-lg dndnode exampleData bg-saffron p-4 rounded-md cursor-pointer"
              onDragStart={(event) => onDragStart(event, node.id, node.name)}
              draggable
            >
              {node.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NodesPanel;
