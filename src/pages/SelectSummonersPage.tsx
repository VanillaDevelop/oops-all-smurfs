import React, {useContext, useEffect} from "react"
import {AppContext} from "@/context/AppContext";
import PlayerDisplay from "@/components/PlayerDisplay";
import "./SelectSummonersPage.scss"
import {ISuspiciousSummoner} from "@/Interfaces";
import BackButton from "@/components/BackButton";
import {useNavigate} from "react-router-dom";

export default function SelectSummonersPage()
{
    const {summoner, matches, suspiciousSummoners, setSuspiciousSummoners} = useContext(AppContext);
    const navigate = useNavigate();

    const matchElems = matches.map((match, i) => {
        const suspicious_in_match = suspiciousSummoners.filter(x => x.matchId === match.info.gameId)
        if(suspicious_in_match.length === 0) return null;

        const participants = suspicious_in_match.map((participant) => {
            return <PlayerDisplay player={participant} match={match} />
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
        <div>
            <div className="matchDisplay container flex-col-center">
                <h1>Smurf Check</h1>
                <p className="infoParagraph">Oopsie! In your last {matches.length} matches, there were <strong>{suspiciousSummoners.length} potential
                    smurfs</strong> (accounts below summoner level 50)! Want to learn more?
                    Click on any of the accounts below to learn more about them (surely only good things).</p>
                <div>
                    {matchElems}
                </div>
            </div>
            <BackButton onClick={() => navigate("/home")}/>
        </div>
    )
}
