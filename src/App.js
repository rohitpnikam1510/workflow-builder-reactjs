import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import WorkflowPanel from './components/workflow-components/WorkflowPanel';
import OutputPanel from './components/workflow-components/OutputPanel';
import { RFInstanceProvider } from './components/workflow-components/RFInstanceContext';
import { ErrorBoundary } from 'react-error-boundary';
import FallbackUI from './components/FallbackUI';

function App() {
  useEffect(() => {
    const doc = document.firstElementChild
    doc.setAttribute('color-scheme', 'grape')
  }, []);

  return (
    <ErrorBoundary FallbackComponent={FallbackUI}>
      <RFInstanceProvider>
        <div className="h-screen flex flex-col">
          <Header />
          <div className="flex-grow">
            <WorkflowPanel />
          </div>
          <OutputPanel />
        </div>
      </RFInstanceProvider>
    </ErrorBoundary>
  );
}

export default App;
