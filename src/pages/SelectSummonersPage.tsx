import React, {useContext, useEffect} from "react"
import {AppContext} from "@/context/AppContext";
import PlayerDisplay from "@/components/PlayerDisplay";
import "./SelectSummonersPage.scss"
import {ISuspiciousSummoner} from "@/Interfaces";

export default function SelectSummonersPage()
{
    const {summoner, matches} = useContext(AppContext);
    const [suspiciousSummoners, setSuspiciousSummoners] = React.useState([] as ISuspiciousSummoner[])

    //One-time setup of suspicious summoners from props
    useEffect(() => {
        const suspicious = matches.map(match => {
            return match.info.participants.map(participant => {
                if (participant.summonerLevel >= 50 || participant.summonerLevel < 30) return null;
                return {matchId: match.info.gameId, summoner: participant, flagged: false}
            }).filter(x => x !== null)
        }).flat() as ISuspiciousSummoner[]
        setSuspiciousSummoners(suspicious)
    }, [])

    const matchElems = matches.map((match, i) => {
        const suspicious_in_match = suspiciousSummoners.filter(x => x.matchId === match.info.gameId)
        if(suspicious_in_match.length === 0) return null;

        const user_team = match.info.participants.find((participant) => participant.summonerName === summoner.name);

        const participants_sorted = match.info.participants.sort((a, b) => a.teamId - b.teamId)

        const participants = participants_sorted.map((participant) => {
            if(participant.summonerLevel >= 50) return null;
            return <PlayerDisplay player={participant} match={match} player_team={user_team?.teamId ?? 0} />
        })

        const date = new Date(match.info.gameStartTimestamp)


        return (
        <div className="match">
            <h2>Game {i+1} - {date.toLocaleDateString()} - {date.toLocaleTimeString()}</h2>
            <div className="matchGrid">
                {participants}
            </div>
        </div>)
    })


    return (
        <div className="matchDisplay">
            <h1>Smurf Check</h1>
            <p>Oopsie! In your last {matches.length} matches, there were <strong>{suspiciousSummoners.length} potential
                smurfs</strong> (accounts below summoner level 50)! <br />
                Want to learn more? Click on any of the accounts below to learn more about them (surely only good things).</p>
            <div>
                {matchElems}
            </div>
        </div>
    )
}
