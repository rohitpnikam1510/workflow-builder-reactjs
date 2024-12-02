import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Fallback UI Component
const FallbackUI = ({ error, resetErrorBoundary }) => {
    return (
        <div className="error-boundary">
            <h2>Something went wrong!</h2>
            <p>{error?.message}</p>
            <button onClick={resetErrorBoundary}>Try Again</button>
        </div>
    );
};
export default FallbackUI;
