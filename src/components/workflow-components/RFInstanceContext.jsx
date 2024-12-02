import React, { createContext, useContext, useState } from 'react';

const RFInstanceContext = createContext(null);

export const RFInstanceProvider = ({ children }) => {
    const [rfInstance, setRfInstance] = useState(null);

    return (
        <RFInstanceContext.Provider value={{ rfInstance, setRfInstance }}>
            {children}
        </RFInstanceContext.Provider>
    );
};

export const useRFInstance = () => useContext(RFInstanceContext);
