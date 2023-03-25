import React, {createContext} from 'react';

const AppContext = createContext({})

function AppContextProvider(children: React.ReactNode)
{
    return (
        <AppContext.Provider value={{}}>
            {children}
        </AppContext.Provider>
    )
}

export {AppContext, AppContextProvider}