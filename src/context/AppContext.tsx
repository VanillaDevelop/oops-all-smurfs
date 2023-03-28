import React, {createContext} from 'react';
import {IAppContext} from "@/Interfaces";

const AppContext = createContext<IAppContext>({} as IAppContext);

function AppContextProvider(props: { children: React.ReactElement })
{
    const [summoner, setSummoner] = React.useState({});



    return (
        <AppContext.Provider value={{
            setSummoner
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export {AppContext, AppContextProvider}