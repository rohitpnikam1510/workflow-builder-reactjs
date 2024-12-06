import React, { useState } from 'react';
import { useDnD } from './DnDContext';
import { NodeType } from '../../utils/nodeTypes';
import { useRFInstance } from './RFInstanceContext';

const NodesPanel = () => {
  const [openAlertForSaveWorkflow, setOpenAlertForSaveWorkflow] = useState(false);
  const [isSavingWorkflow, setIsSavingWorkflow] = useState(false);
  const [newWorflowName, setNewWorkflowName] = useState("");
  const { setType, setName } = useDnD();
  const { rfInstance } = useRFInstance();

  const onDragStart = (event, nodeType, nodeName) => {
    setType(nodeType);
    setName(nodeName)
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNewWorkflow = () => {
    if (!rfInstance) return;
    
    const currentNodes = rfInstance.getNodes();
    const currentEdges = rfInstance.getEdges();

    if (currentNodes.length > 0 || currentEdges.length > 0) {
      if (rfInstance) {
        setOpenAlertForSaveWorkflow(!openAlertForSaveWorkflow);
      }
    } else {
      addNeworkflow();
    }
  }

  const saveWorkflow = () => {
    setIsSavingWorkflow(!isSavingWorkflow);
    setOpenAlertForSaveWorkflow(!openAlertForSaveWorkflow);
    addNeworkflow();
  }

  const handleInputChange = (e) => {
    const { value } = e.target;
    setNewWorkflowName(value);
  }

  const skipWithoutSaving = () => {
    setOpenAlertForSaveWorkflow(!openAlertForSaveWorkflow);
    addNeworkflow();
  }

  const addNeworkflow = () => {
    setNewWorkflowName('');
    if (rfInstance) {
      rfInstance.setNodes([]);
      rfInstance.setEdges([]);
      rfInstance.setViewport({ x: 0, y: 0, zoom: 1 });
    }
  }

  return (
    <div className="bg-sidebar text-sidebarText p-4 w-1/5 overflow-y-auto scrollbar-thin">
      <div className="grid gap-4 mb-2">
        <div
          className="bg-sidebarButton text-sidebarButtonText border border-sidebarButtonBorder px-4 py-2 rounded-md
    hover:bg-sidebarButtonHoverBg hover:border-sidebarButtonHoverBorder transition duration-200 ease-in-out text-textPrimary newWorkflow rounded-md cursor-pointer grid justify-items-center"
          onClick={(event) => handleNewWorkflow(event)}
        >
          + New
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-[--primary] text-lg font-semibold border-b-2 border-[--primary]">Input</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
        <div
          className="bg-sidebarButton text-sidebarButtonText border border-sidebarButtonBorder px-4 py-2 rounded-md
    hover:bg-sidebarButtonHoverBg hover:border-sidebarButtonHoverBorder transition duration-200 ease-in-out text-textPrimary dndnode fileInput rounded-md cursor-pointer grid justify-items-center"
          onDragStart={(event) => onDragStart(event, 'fileInput', 'File')}
          draggable

        >
          <span
            className="svg-container grid justify-items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </span>

          File
        </div>
      </div>

      {/* Select Node */}
      <div className="mb-6 mt-2">
        <h2 className="text-[--primary] text-lg font-semibold mb-2 border-b-2 border-[--primary]">Transform Node</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {NodeType.map((node) => (
          <div
            key={node.id}
            className="bg-sidebarButton text-sidebarButtonText border border-sidebarButtonBorder px-4 py-2 rounded-md
  hover:bg-sidebarButtonHoverBg hover:border-sidebarButtonHoverBorder transition duration-200 ease-in-out text-textPrimary dndnode exampleData rounded-md cursor-pointer grid justify-items-center"
            onDragStart={(event) => onDragStart(event, node.id, node.name)}
            draggable
          >
            {node.svg && (
              <span
                className="svg-container grid justify-items-center"
                dangerouslySetInnerHTML={{ __html: node.svg }}
              />
            )}

            <span>
              {node.name}
            </span>
          </div>
        ))}
      </div>

      <div id="alertForSaveWorkflow" className={`${openAlertForSaveWorkflow ? `` : `hidden`} fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50`}>
        <div className="bg-white rounded-lg w-1/3">
          <div className="flex justify-between items-center border-b p-4 mb-4">
            <h2 className="text-xl font-semibold">Save Workflow</h2>
            <button
              id="closeModal"
              className="text-gray-600 hover:text-black focus:outline-none"
              onClick={() => setOpenAlertForSaveWorkflow(false)}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="modal-body p-4">
            <form>
              <label className="block mb-2 font-medium text-gray-700">
                Enter a name for the workflow:
              </label>
              <input
                name="newWorkflowName"
                value={newWorflowName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Workflow Name"
              />
            </form>
          </div>
          <div className="mt-4 border-t p-4 flex justify-end gap-2">
            <button
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              onClick={() => setOpenAlertForSaveWorkflow(false)}
            >
              Close
            </button>
            <button
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              onClick={() => skipWithoutSaving()}
            >
              Skip
            </button>
            <button
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
              onClick={() => saveWorkflow()}
            >
              Save & Add New
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default NodesPanel;
