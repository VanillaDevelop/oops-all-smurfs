import React, {createContext} from 'react';
import {IAppContext, ISuspiciousSummoner} from "@/Interfaces";
import {MatchV5DTOs, SummonerV4DTO} from "twisted/dist/models-dto";

const AppContext = createContext<IAppContext>({} as IAppContext);

function AppContextProvider(props: { children: React.ReactElement })
{
    const [summoner, setSummoner] = React.useState({} as SummonerV4DTO);
    const [matches, setMatches] = React.useState([] as MatchV5DTOs.MatchDto[])
    const [suspiciousSummoners, setSuspiciousSummoners] = React.useState([] as ISuspiciousSummoner[])


    return (
        <AppContext.Provider value={{
            summoner,
            setSummoner,
            matches,
            setMatches,
            suspiciousSummoners,
            setSuspiciousSummoners
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export {AppContext, AppContextProvider}