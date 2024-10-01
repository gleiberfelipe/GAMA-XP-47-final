import React, { createContext } from 'react';

interface ProviderType {
    
   children: any;
   context: any;
   
    

}

const Context = createContext({});
const InternalProvider = ({ children, context }:ProviderType ) => {
    return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default InternalProvider;
export { Context };