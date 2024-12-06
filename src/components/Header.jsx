import React, { useState, useEffect } from 'react';
import { useRFInstance } from '../components/workflow-components/RFInstanceContext';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const { rfInstance } = useRFInstance();

  const flowKey = 'workflows'; // Use a consistent key for localStorage

  // Load saved workflows on component mount
  useEffect(() => {
    const savedWorkflows = JSON.parse(localStorage.getItem(flowKey)) || [];
    setWorkflows(savedWorkflows);
  }, []);

  // Save the current workflow with a name
  const onSave = () => {
    if (!rfInstance) return;

    const name = prompt('Enter a name for the workflow:');
    if (!name) {
      alert('Workflow name is required.');
      return;
    }

    const flow = rfInstance.toObject();
    const newWorkflow = { id: Date.now(), name, flow }; // Add a unique ID and name
    const updatedWorkflows = [...workflows, newWorkflow];

    localStorage.setItem(flowKey, JSON.stringify(updatedWorkflows));
    setWorkflows(updatedWorkflows);

    alert(`Workflow "${name}" saved!`);
  };

  // Restore a saved workflow
  const onRestore = (workflowId) => {
    const selectedWorkflow = workflows.find((workflow) => workflow.id === workflowId);
    if (selectedWorkflow && rfInstance) {
      const { flow } = selectedWorkflow;
      rfInstance.setNodes(flow.nodes || []);
      rfInstance.setEdges(flow.edges || []);
      rfInstance.setViewport(flow.viewport || { x: 0, y: 0, zoom: 1 });
      alert(`Workflow "${selectedWorkflow.name}" restored!`);
    }
  };

  return (
    <header className="bg-header text-headerText p-4 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-xl font-bold">Work-Flow Builder</h1>

      {/* Save Button with Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="bg-sidebarButton text-sidebarButtonText border border-sidebarButtonBorder px-4 py-2 rounded-md
    hover:bg-sidebarButtonHoverBg hover:border-sidebarButtonHoverBorder rounded hover:bg-opacity-90"
        >
          Save Workflow
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded border border-gray-300 text-black z-10">
            {/* Save Current Workflow */}
            <button
              onClick={onSave}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Save Current Workflow
            </button>
            <hr className="my-1 border-t border-gray-300" />
            {/* Existing Workflows */}
            {workflows.length > 0 ? (
              workflows.map((workflow) => (
                <button
                  key={workflow.id}
                  onClick={() => onRestore(workflow.id)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {workflow.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No saved workflows</div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
