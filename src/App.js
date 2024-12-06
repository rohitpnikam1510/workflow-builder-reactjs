import React from 'react';
import './App.css';
import Header from './components/Header';
import WorkflowPanel from './components/workflow-components/WorkflowPanel';
import OutputPanel from './components/workflow-components/OutputPanel';
import { RFInstanceProvider } from './components/workflow-components/RFInstanceContext';
import { ErrorBoundary } from 'react-error-boundary';
import FallbackUI from './components/FallbackUI';

function App() {
  return (
    <ErrorBoundary FallbackComponent={FallbackUI}>
      <RFInstanceProvider>
          <div className="flex flex-col h-screen scrollbar-thin">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <WorkflowPanel />
            </div>
            <OutputPanel />
          </div>
      </RFInstanceProvider>
    </ErrorBoundary>
  );
}

export default App;
