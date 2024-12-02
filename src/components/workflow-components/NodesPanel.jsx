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
    <div className="bg-black p-4 w-1/5 h-full border-r-4 border-saffron">

      <div className="mb-6">
        <h2 className="text-skyblue text-lg font-semibold mb-2 border-b-2 border-skyblue">Input</h2>
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
          className="dndnode fileInput bg-saffron p-4 rounded-md cursor-pointer"
          onDragStart={(event) => onDragStart(event, 'fileInput', 'File')}
          draggable
        >
          File
        </div>
      </div>

      {/* Select Node */}
      <div className="mb-6 mt-2">
        <h2 className="text-skyblue text-lg font-semibold mb-2 border-b-2 border-skyblue">Transform Node</h2>
        <div className="space-y-4">
          {NodeType.map((node) => (
            <div
              key={node.id}
              className="dndnode exampleData bg-saffron p-4 rounded-md cursor-pointer"
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
