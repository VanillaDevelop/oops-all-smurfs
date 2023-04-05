import React, {useContext} from "react"
import {useNavigate, useParams} from "react-router-dom";
import {AppContext} from "@/context/AppContext";
import BackButton from "@/components/BackButton";
import "./SummonerDetails.scss"
import SmurfIndicator from "@/components/SmurfIndicator";
import {ISmurfIndicator} from "@/Interfaces";
import RecentMatch from "@/components/RecentMatch";

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

    const recentMatches = suspiciousSummoner?.data?.recentMatches.map(m => <RecentMatch match={m} summoner_id={puuid ?? ""} />)

    const winrate = Math.round(stats.wins/(suspiciousSummoner?.data?.recentMatches.length ?? 1)*100)
    const pings_per_game = Math.round((stats.pings_w + stats.pings_l)/match_length)
    const pings_per_loss = Math.round(stats.pings_l/(match_length - stats.wins))

    const smurfChecks = [] as ISmurfIndicator[]
    //Check if the player has a high/low winrate
    if (winrate > 60 || winrate < 40)
        smurfChecks.push({smurf: true, text: `Player has a suspicious winrate (${winrate}%)`})
    else
        smurfChecks.push({smurf: false, text: `Player's winrate is reasonable. (${winrate}%)`})

    //Check if the player has a very low level
    if ((suspiciousSummoner?.summoner.summonerLevel ?? 30) < 40)
        smurfChecks.push({smurf: true, text:`Player has a very low level (${suspiciousSummoner?.summoner.summonerLevel}).`})
    else
        smurfChecks.push({smurf: false, text: `Player's level is reasonable. (${suspiciousSummoner?.summoner.summonerLevel}).`})

    //Check if the player uses many pings
    if (pings_per_game > 10)
        smurfChecks.push({smurf: true, text: `Player has a rather high number of pings per game (${pings_per_game} pings per game).`})
    else
        smurfChecks.push({smurf: false, text: `Player has a reasonable number of pings per game (${pings_per_game} pings per game).`})

    //check if player tends to ping more often on a loss
    if (pings_per_game * 1.2 < pings_per_loss)
        smurfChecks.push({smurf: true, text: `Player tends to ping more often on a loss. (${pings_per_loss} pings per loss).`})
    else
        smurfChecks.push({smurf: false, text: `Player's ping behaviour does not change on wins/losses (${pings_per_loss} pings per loss).`})

    //check if player uses this account regularly (at least one gap of 5 days between games or between last game and now)
    const game_start_timestamps = suspiciousSummoner?.data?.recentMatches.map(m => m.info.gameStartTimestamp).sort() ?? []
    game_start_timestamps.push(Date.now())
    let max_gap_days = 0
    for(let i = 0; i < game_start_timestamps.length - 1; i++) {
        const gap = Math.round((game_start_timestamps[i+1] - game_start_timestamps[i]) / 86400000)
        if (gap > max_gap_days)
            max_gap_days = gap
    }
    if (max_gap_days > 5)
        smurfChecks.push({smurf: true, text: `Player plays irregularly on this account (Max. gap in days between games: ${max_gap_days}).`})
    else
        smurfChecks.push({smurf: false, text: `Player plays somewhat regularly on this account. (Max. gap in days between games: ${max_gap_days}).`})

    //check if player has bot games on his match history
    const bot_games = suspiciousSummoner?.data?.recentMatches.filter(m => m.info.queueId >= 830 && m.info.queueId <= 850).length ?? 0
    if (bot_games > 0)
        smurfChecks.push({smurf: true, text: `Player has played ${bot_games} bot games recently.`})
    else
        smurfChecks.push({smurf: false, text: `Player has not played any bot games.`})

    //check if player duo queues with another suspicious player (appears at least twice with another low level (<50) player)
    let allies = suspiciousSummoner?.data?.recentMatches.map(
        m => m.info.participants.filter(
            (p) => p.puuid !== puuid && p.summonerLevel < 50 && p.teamId == m.info.participants.find(px => px.puuid == puuid)?.teamId)
            .map(p => p.puuid))
        .flat() ?? []
    //check if any of the allies appears more than once
    const has_duo = allies.find(a => allies.filter(b => a == b).length > 1)
    if(has_duo)
    {
        const duo = suspiciousSummoner?.data?.recentMatches.find(m => m.info.participants.find(p => p.puuid == has_duo))?.info.participants.find(p => p.puuid == has_duo)
        if(duo)
            smurfChecks.push({smurf: true, text: `Player duo queues with another low-level player (${duo.summonerName}, Level ${duo.summonerLevel}).`})
    }
    else
        smurfChecks.push({smurf: false, text: `Player does not duo queue with another low-level player.`})
    smurfChecks.sort((a,b) => a.smurf ? -1 : 1)

    const smurfElems = smurfChecks.map(check => <SmurfIndicator indicator={check} />)

    return (
        <div>
            <BackButton onClick={() => navigate("/select-summoners")}/>
            <div className="container flex-col-center">
                <h1>Smurf Check</h1>
                <h2>Summoner Details: {suspiciousSummoner?.summoner.summonerName} (Level {suspiciousSummoner?.summoner.summonerLevel})</h2>
                <h3>Stats</h3>
                <div className="statsBox">
                    <p><strong>Average K/D/A:</strong> {(stats.kills/match_length).toFixed(1)}/{(stats.deaths/match_length).toFixed(1)}/{(stats.assists/match_length).toFixed(1)}</p>
                    <p><strong>Recent Winrate:</strong> {Math.round(stats.wins/(suspiciousSummoner?.data?.recentMatches.length ?? 1)*100)}%</p>
                    <p><strong>Average Pings per Game:</strong> {pings_per_game}</p>
                </div>
                <h3>Smurf Check</h3>
                <p className="textBox">Is this player a smurf or just really gifted at the videogame?
                    Here are some possible indicators.</p>
                <div className="smurfChecks">
                    {smurfElems}
                </div>
                <h3>Recent Matches</h3>
                <div className="matchGrid text-center">
                    {recentMatches}
                </div>
            </div>
        </div>
    )
}