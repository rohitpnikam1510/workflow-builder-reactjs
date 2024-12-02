# Workflow Builder

## Project Overview

**Workflow Builder** is an application that allows users to create, edit, and visualize workflows by performing dynamic operations on large amounts of data. Users can drag and drop different types of nodes (e.g., filter, sort, group, slice) onto a canvas, connect them, and apply operations to CSV data. The results are displayed in a nested tabular format, and users can export the output in both JSON and CSV formats.

## Features

### 1. **Header**
- The header displays the application logo on the left and a "Save Workflow" button on the right.
- Clicking "Save Workflow" allows users to save the current workflow to localStorage and view a list of previously saved workflows.

### 2. **Left Panel**
- The left panel contains groups of nodes:
  - **Input Node**: Allows users to drag a file node and upload a `.csv` file for processing.
  - **Transform Nodes**: Includes four types of transformation nodes:
    1. **Filter**: Filter the data based on specified criteria.
    2. **Sort**: Sort the data based on selected fields.
    3. **Group**: Group the data based on specified fields.
    4. **Slice**: Slice the data based on conditions.

### 3. **Workflow Canvas**
- Users can drag and drop nodes from the left panel onto the canvas and connect them to create workflows that manipulate the selected datasets.

### 4. **Output Panel**
- After setting up the workflow, users can click the "Run" button to apply the operations on the dataset.
- The output is displayed in a nested tabular format, and users can export the result in JSON and CSV formats.

## Technologies Used

- **React.js**: Frontend UI for building and visualizing workflows.
- **Redux**: State management for handling application data and workflow states.
- **React Flow**: For building interactive workflow diagrams with draggable nodes.
- **Papa Parse**: For parsing and exporting CSV files.
- **Tailwind CSS**: For styling the application.

## Prerequisites

- Node.js version 18.x
- npm or yarn for managing dependencies

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/your-username/workflow-builder.git
cd workflow-builder
```

### 2. Install Dependancies:

```bash
npm install
# or if you are using yarn
yarn install
```

### 3. Start the development server:

```bash
npm start
# or if you are using yarn
yarn start
```

The application should now be running at http://localhost:3000.

## Usage

### 1. Create a Workflow:
- Drag and drop nodes from the left panel to the canvas.
- Configure the nodes with relevant settings (e.g., file upload for the File Node, filter criteria for the Filter Node).
- Connect the nodes by dragging lines between them.

### 2. Run the Workflow:
- Click the "Run" button to apply operations to the selected CSV file.
- View the results in the Output Panel in a nested tabular format.

### 3. Save the Workflow:
- Click the "Save Workflow" button in the header to save the current workflow to localStorage.
- View and load previously saved workflows from the list.

### 4. Export the Result:
- Once the workflow is executed, users can export the result in JSON or CSV format.

## Acknowledgments
- React Flow: https://reactflow.dev/
- Papa Parse: https://www.papaparse.com/
- Tailwind CSS: https://tailwindcss.com/
- Redux: https://www.npmjs.com/package/react-redux
