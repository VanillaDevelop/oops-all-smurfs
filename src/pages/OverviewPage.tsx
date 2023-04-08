import React, {useContext} from "react"
import {AppContext} from "@/context/AppContext";
import PlayerDisplay from "@/components/PlayerDisplay";
import "./OverviewPage.scss"
import BackButton from "@/components/BackButton";
import {useNavigate} from "react-router-dom";

export default function OverviewPage()
{
    const {matches, suspiciousSummoners, summoner} = useContext(AppContext);
    const navigate = useNavigate();

    const winrate = Math.round(matches.map((match) : number => {
        return match.info.participants.find(x => x.puuid === summoner.puuid)?.win ? 1 : 0;
    }).reduce((a, b) => a + b, 0) / matches.length  * 100);

    const game_smurfs = matches.map((match) => {
        // count allies as +1, enemies as -1
        const suspicious_in_match = suspiciousSummoners.filter(x => x.matchId === match.info.gameId)
            .map((suspicious) => suspicious.ally ? 1 : -1)

        // return some info about the match
        return {match,
            numbers_advantage: suspicious_in_match.reduce((a, b) => a + b, 0),
            clean: suspicious_in_match.length === 0,
            win: match.info.participants.find(x => x.puuid === summoner.puuid)?.win
        }
    })

    const smurf_allies = suspiciousSummoners.filter(x => x.ally).length
    const smurf_enemies = suspiciousSummoners.filter(x => !x.ally).length

    const ally_kda_avg : {[key: string]: number} = suspiciousSummoners.filter(x => x.ally).map(x => {
        return {
            kills: x.summoner.kills / smurf_allies,
            deaths: x.summoner.deaths / smurf_allies,
            assists: x.summoner.assists / smurf_allies
        }
    }).reduce((a, b) => {
        return {
            kills: a.kills + b.kills,
            deaths: a.deaths + b.deaths,
            assists: a.assists + b.assists
        }
    })

    const enemy_kda_avg = suspiciousSummoners.filter(x => !x.ally).map(x => {
        return {
            kills: x.summoner.kills / smurf_enemies,
            deaths: x.summoner.deaths / smurf_enemies,
            assists: x.summoner.assists / smurf_enemies
        }
    }).reduce((a, b) => {
        return {
            kills: a.kills + b.kills,
            deaths: a.deaths + b.deaths,
            assists: a.assists + b.assists
        }
    })

    const outnumbered_matches = game_smurfs.filter(match => match.numbers_advantage < 0).length
    const outnumbers_matches = game_smurfs.filter(match => match.numbers_advantage > 0).length
    const even_matches = game_smurfs.filter(match => match.numbers_advantage === 0 && !match.clean).length

    const outnumbered_winrate = Math.round(game_smurfs.filter(match => match.numbers_advantage < 0 && match.win).length / outnumbered_matches * 100)
    const outnumbers_winrate = Math.round(game_smurfs.filter(match => match.numbers_advantage > 0 && match.win).length / outnumbers_matches * 100)
    const even_winrate = Math.round(game_smurfs.filter(match => match.numbers_advantage === 0 && !match.clean && match.win).length / even_matches * 100)


    const matchElems = matches.map((match, i) => {
        const suspicious_in_match = suspiciousSummoners.filter(x => x.matchId === match.info.gameId)
        if(suspicious_in_match.length === 0) return null;

        const participants = suspicious_in_match.map((participant) => {
            return <PlayerDisplay player={participant} match={match} key={match.metadata.matchId
                 + participant.summoner.puuid} />
        })
        const date = new Date(match.info.gameStartTimestamp)


        return (
        <div className="match" key={match.metadata.matchId}>
            <h3>Game {i+1} - {date.toLocaleDateString()} - {date.toLocaleTimeString()}</h3>
            <div className="matchGrid">
                {participants}
            </div>
        </div>)
    })

    return (
        <div>
            <div className="matchDisplay container flex-col-center">
                <h1>Smurf Check</h1>
                <h2>Stats</h2>
                <div className="statsBox">
                    <p className="statsEntry"><strong>Winrate:</strong> {winrate}%</p>
                    <p className="statsEntry"><strong>Games played:</strong> {matches.length}</p>
                    <p className="statsEntry"><strong>Games without smurfs:</strong> {game_smurfs.filter(match => match.clean).length}</p>
                    {outnumbered_matches > 0 && <p className="statsEntry">
                        <strong>Winrate when outnumbered:</strong> {outnumbered_winrate}% ({outnumbered_matches} game{outnumbered_matches == 1 ? "" : "s"})
                    </p>}
                    {outnumbers_matches > 0 && <p className="statsEntry">
                        <strong>Winrate when outnumbering:</strong> {outnumbers_winrate}% ({outnumbers_matches} game{outnumbers_matches == 1 ? "" : "s"})
                    </p>}
                    {even_matches > 0 && <p className="statsEntry">
                        <strong>Winrate in even matches:</strong> {even_winrate}% ({even_matches} game{even_matches == 1 ? "" : "s"})
                    </p>}
                    <p className="statsEntry">
                        <strong>Average low-level ally statistics: </strong>
                        { Math.round(ally_kda_avg.kills) }/
                        { Math.round(ally_kda_avg.deaths) }/
                        { Math.round(ally_kda_avg.assists) }
                    </p>
                    <p className="statsEntry">
                        <strong>Average low-level enemy statistics: </strong>
                        { Math.round(enemy_kda_avg.kills) }/
                        { Math.round(enemy_kda_avg.deaths) }/
                        { Math.round(enemy_kda_avg.assists) }
                    </p>
                </div>
                <h2>User Details</h2>
                <p className="infoParagraph">Oopsie! In your last {matches.length} matches, there were <strong>{suspiciousSummoners.length} potential
                    smurfs</strong> (accounts below summoner level 50)! Want to learn more?
                    Click on any of the accounts below to learn more about them (surely only good things).
                </p>
                <div>
                    {matchElems}
                </div>
            </div>
            <BackButton onClick={() => navigate("/enter-summoner-data")}/>
        </div>
    )
}
