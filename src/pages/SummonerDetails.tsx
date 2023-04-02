import React, {useContext} from "react"
import {useParams} from "react-router-dom";
import {AppContext} from "@/context/AppContext";

export default function SummonerDetails()
{
    const { puuid } = useParams<{puuid: string}>();
    const {suspiciousSummoners} = useContext(AppContext);
    const suspiciousSummoner = suspiciousSummoners.find(s => s.summoner.puuid === puuid)

    const recentMatches = suspiciousSummoner?.data?.recentMatches.map(m => {
        return (
        <div>
            <h3>{m.info.gameStartTimestamp}</h3>
        </div>
        )
    })

    return (
        <div>
            <h1>Summoner Details: {suspiciousSummoner?.summoner.summonerName}</h1>
            {recentMatches}
        </div>
    )
}