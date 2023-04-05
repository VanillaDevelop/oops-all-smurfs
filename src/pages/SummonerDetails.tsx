import React, {useContext} from "react"
import {useNavigate, useParams} from "react-router-dom";
import {AppContext} from "@/context/AppContext";
import BackButton from "@/components/BackButton";
import "./SummonerDetails.scss"
import SmurfIndicator from "@/components/SmurfIndicator";

export default function SummonerDetails()
{
    const { puuid } = useParams();
    const {suspiciousSummoners} = useContext(AppContext);
    const suspiciousSummoner = suspiciousSummoners.find(s => s.summoner.puuid === puuid)
    const navigate = useNavigate();

    const stats = {
        "kills": 0,
        "deaths": 0,
        "assists": 0,
        "wins": 0,
        "pings_l": 0,
        "pings_w": 0
    }
    const match_length = suspiciousSummoner?.data?.recentMatches.length ?? 1;

    for (let i = 0; i < (suspiciousSummoner?.data?.recentMatches.length ?? 0); i++) {
        const match = suspiciousSummoner?.data?.recentMatches[i];
        const summoner = match?.info.participants.find(p => p.puuid === puuid)
        if (match && summoner) {
            stats.kills += summoner.kills;
            stats.deaths += summoner.deaths;
            stats.assists += summoner.assists;
            if (match.info.teams.find(t => t.teamId == summoner.teamId)?.win) {
                stats.wins++;
                //@ts-ignore
                stats.pings_w += summoner.enemyMissingPings + summoner.baitPings
            } else {
                //@ts-ignore
                stats.pings_l += summoner.enemyMissingPings + summoner.baitPings
            }
        }
    }

    const recentMatches = suspiciousSummoner?.data?.recentMatches.map(m => {
        return (
        <div>
            <h5>{m.info.gameStartTimestamp}</h5>
            {m.info.queueId}
        </div>
        )
    })

    const winrate = Math.round(stats.wins/(suspiciousSummoner?.data?.recentMatches.length ?? 1)*100)
    const pings_per_game = Math.round((stats.pings_w + stats.pings_l)/match_length)
    const pings_per_loss = Math.round(stats.pings_l/(match_length - stats.wins))

    const smurfChecks = []
    //Check if the player has a high winrate
    if (winrate > 60)
        smurfChecks.push(<SmurfIndicator smurf={true} text={`Player has a suspiciously high recent winrate (${winrate}%)`} />)
    else
        smurfChecks.push(<SmurfIndicator smurf={false} text={`Player's winrate is reasonable. (${winrate}%)`} />)

    //Check if the player has a very low level
    if ((suspiciousSummoner?.summoner.summonerLevel ?? 30) < 35)
        smurfChecks.push(<SmurfIndicator smurf={true} text={`Player has a suspiciously low level (${suspiciousSummoner?.summoner.summonerLevel}).`} />)
    else
        smurfChecks.push(<SmurfIndicator smurf={false} text={`Player's level is reasonable. (${suspiciousSummoner?.summoner.summonerLevel}).`} />)

    //Check if the player uses many pings
    if (pings_per_game > 10)
        smurfChecks.push(<SmurfIndicator smurf={true} text={`Player has a rather high number of pings per game (${pings_per_game}).`} />)
    else
        smurfChecks.push(<SmurfIndicator smurf={false} text={`Player has a reasonable number of pings per game (${pings_per_game}).`} />)

    //check if player tends to ping more often on a loss
    if (pings_per_game * 1.2 < pings_per_loss)
        smurfChecks.push(<SmurfIndicator smurf={true} text={`Player tends to ping more often on a loss. (${pings_per_loss} pings per loss).`} />)
    else
        smurfChecks.push(<SmurfIndicator smurf={false} text={`Player's ping behaviour does not change on wins/losses (${pings_per_loss} pings per loss).`} />)

    //check if player uses this account regularly (at least one gap of 5 days between games)

    //check if player has bot games on his match history

    //check if player duo queues with another suspicious player (appears at least twice with another suspicious player)

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
                    <p><strong>Average Pings per Game:</strong> {pings_per_game}</p>
                </div>
                <h3>Smurf Check</h3>
                <p className="textBox">Is this player a smurf or just really gifted at the videogame?
                    Here are some possible indicators.</p>
                <div className="smurfChecks">
                    {smurfChecks}
                </div>
                <h3 className="text-center">Recent Matches</h3>
                <div className="matchGrid text-center">
                    {recentMatches}
                </div>
            </div>
        </div>
    )
}