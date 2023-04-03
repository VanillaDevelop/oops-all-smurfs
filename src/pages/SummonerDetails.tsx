import React, {useContext} from "react"
import {useNavigate, useParams} from "react-router-dom";
import {AppContext} from "@/context/AppContext";
import BackButton from "@/components/BackButton";
import "./SummonerDetails.scss"

export default function SummonerDetails()
{
    const { puuid } = useParams<{puuid: string}>();
    const {suspiciousSummoners} = useContext(AppContext);
    const suspiciousSummoner = suspiciousSummoners.find(s => s.summoner.puuid === puuid)
    const navigate = useNavigate();

    const stats = {
        "kills": 0,
        "deaths": 0,
        "assists": 0,
        "wins": 0,
    }
    const match_length = suspiciousSummoner?.data?.recentMatches.length ?? 1;

    for (let i = 0; i < (suspiciousSummoner?.data?.recentMatches.length ?? 0); i++) {
        const match = suspiciousSummoner?.data?.recentMatches[i];
        const summoner = match?.info.participants.find(p => p.puuid === puuid)
        if(match && summoner) {
            stats.kills += summoner.kills;
            stats.deaths += summoner.deaths;
            stats.assists += summoner.assists;
            if (match.info.teams.find(t => t.teamId == summoner.teamId)?.win)
                stats.wins++;
            }
        }

    const recentMatches = suspiciousSummoner?.data?.recentMatches.map(m => {
        return (
        <div>
            <h5>{m.info.gameStartTimestamp}</h5>
        </div>
        )
    })

    return (
        <div>
            <BackButton onClick={() => navigate("/select-summoners")}/>
            <div className="container flex-col-center">
                <h1>Smurf Check</h1>
                <h2 className="text-center">Summoner Details: {suspiciousSummoner?.summoner.summonerName} (Level {suspiciousSummoner?.summoner.summonerLevel})</h2>
                <h3 className="text-center">Stats</h3>
                <div className="statsBox">
                    <p><strong>Average K/D/A:</strong> {(stats.kills/match_length).toFixed(1)}/{(stats.deaths/match_length).toFixed(1)}/{(stats.assists/match_length).toFixed(1)}</p>
                    <p><strong>Recent Winrate:</strong> {Math.round(stats.wins/(suspiciousSummoner?.data?.recentMatches.length ?? 1)*100)}%</p>
                </div>
                <h3>Smurf Check</h3>
                <p className="textBox">Is this player a smurf or just really gifted at the videogame?
                    Here are some possible indicators.</p>
                <h3 className="text-center">Recent Matches</h3>
                <div className="matchGrid text-center">
                    {recentMatches}
                </div>
            </div>
        </div>
    )
}