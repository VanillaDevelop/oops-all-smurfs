import React, {useContext, useEffect, useState} from "react"
import {ipcRenderer} from "electron";
import LoadingBar from "@/components/LoadingBar";
import {useNavigate, useParams} from "react-router-dom";
import {AppContext} from "@/context/AppContext";
import {MatchV5DTOs} from "twisted/dist/models-dto";

export default function LoadingSummonerPage()
{
    const [loading, setLoading] = useState<number[]>([0,0,0]);
    const navigate = useNavigate();
    const {suspiciousSummoners, setSuspiciousSummoners} = useContext(AppContext);

    const { puuid } = useParams<{puuid: string}>();

    const summoner = suspiciousSummoners.find(s => s.summoner.puuid === puuid)

    useEffect(() => {
        async function getPlayerMatches() {
            const matches = await ipcRenderer.invoke('getSummonerMatches', puuid)
            if(matches.length == 0)
                return navigate('/select-summoners')

            const matchDetails: MatchV5DTOs.MatchDto[] = []
            setLoading([0, 0, matches.length])
            for (let i = 0; i < matches.length; i++)
            {
                setLoading([0, i, matches.length])
                const match = await ipcRenderer.invoke('getSummonerMatchDetails', matches[i])
                if (match !== null)
                    matchDetails.push(match)
                setLoading([0, i, matches.length])
            }
            if(matchDetails.length == 0)
                return navigate('/select-summoners')

            setSuspiciousSummoners(oldSuspiciousSummoners => {
                return oldSuspiciousSummoners.map(s => s.summoner.puuid !== puuid ?
                    s : {...s, data: {recentMatches: matchDetails}})
            })
            navigate('/summoner-details/' + puuid)
        }
        getPlayerMatches().catch((e) => console.log(e))
    }, [])

    return (
        <div className="container flex-col-center">
            <h2>Loading Matches for {summoner?.summoner.summonerName}...</h2>
            {loading[1] !== loading[2] && <LoadingBar min={loading[0]} current={loading[1]} max={loading[2]}/>}
        </div>
    )
}