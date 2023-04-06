import React, {useContext} from "react"
import {AppContext} from "@/context/AppContext";
import PlayerDisplay from "@/components/PlayerDisplay";
import "./SelectSummonersPage.scss"
import BackButton from "@/components/BackButton";
import {useNavigate} from "react-router-dom";

export default function OverviewPage()
{
    const {matches, suspiciousSummoners, summoner} = useContext(AppContext);
    const navigate = useNavigate();

    const winrate = matches.map((match) : number => {
        return match.info.participants.find(x => x.puuid === summoner.puuid)?.win ? 1 : 0;
    }).reduce((a, b) => a + b, 0) / matches.length;

    const smurfs_per_game = matches.map((match) => {
        const suspicious_in_match = suspiciousSummoners.filter(x => x.matchId === match.info.gameId)
            .map((suspicious) => suspicious.ally ? 1 : -1)

        return {match,
            numbers_advantage: suspicious_in_match.reduce((a, b) => a + b, 0),
            clean: suspicious_in_match.length === 0,
            win: match.info.participants.find(x => x.puuid === summoner.puuid)?.win
        }
    })

    const ally_kda_sum = suspiciousSummoners.filter(x => x.ally).map(x => {
        return {
            kills: x.summoner.kills,
            deaths: x.summoner.deaths,
            assists: x.summoner.assists
        }
    }).reduce((a, b) => {
        return {
            kills: a.kills + b.kills,
            deaths: a.deaths + b.deaths,
            assists: a.assists + b.assists
        }
    })

    const enemy_kda_sum = suspiciousSummoners.filter(x => !x.ally).map(x => {
        return {
            kills: x.summoner.kills,
            deaths: x.summoner.deaths,
            assists: x.summoner.assists
        }
    }).reduce((a, b) => {
        return {
            kills: a.kills + b.kills,
            deaths: a.deaths + b.deaths,
            assists: a.assists + b.assists
        }
    })

    const statsBox = (
        <div className="statsBox">
            <h2>Stats</h2>
            <p>Your Base Winrate: {winrate * 100}%</p>
            <p>Games played: {matches.length}</p>
            <p>Games without smurfs: {smurfs_per_game.filter(match => match.clean).length}</p>
            <p>
                Winrate when there were more low-level accounts on the enemy team: {
                smurfs_per_game.filter(match => match.numbers_advantage < 0 && match.win).length / smurfs_per_game.filter(match => match.numbers_advantage < 0).length * 100
            }% ({smurfs_per_game.filter(match => match.numbers_advantage < 0).length} game(s))
            </p>
            <p>
                Winrate when there were more low-level accounts on your team: {
                smurfs_per_game.filter(match => match.numbers_advantage > 0 && match.win).length / smurfs_per_game.filter(match => match.numbers_advantage > 0).length * 100
            }% ({smurfs_per_game.filter(match => match.numbers_advantage > 0).length} game(s))
            </p>
            <p>
                Winrate when low-level accounts were evenly distributed: {
                smurfs_per_game.filter(match => match.numbers_advantage === 0 && !match.clean && match.win).length / smurfs_per_game.filter(match => match.numbers_advantage === 0 && !match.clean).length * 100
            }% ({smurfs_per_game.filter(match => match.numbers_advantage === 0 && !match.clean).length} game(s))
            </p>
            <p>
                The average low-level account statistics on your team:
                { (ally_kda_sum.kills / suspiciousSummoners.filter(x => x.ally).length).toFixed(2) }/
                { (ally_kda_sum.deaths / suspiciousSummoners.filter(x => x.ally).length).toFixed(2) }/
                { (ally_kda_sum.assists / suspiciousSummoners.filter(x => x.ally).length).toFixed(2) }
            </p>
            <p>
                The average low-level account statistics on the enemy team:
                { (enemy_kda_sum.kills / suspiciousSummoners.filter(x => !x.ally).length).toFixed(2) }/
                { (enemy_kda_sum.deaths / suspiciousSummoners.filter(x => !x.ally).length).toFixed(2) }/
                { (enemy_kda_sum.assists / suspiciousSummoners.filter(x => !x.ally).length).toFixed(2)}
            </p>
        </div>
    )

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
                    Click on any of the accounts below to learn more about them (surely only good things).
                </p>
                {statsBox}
                <div>
                    {matchElems}
                </div>
            </div>
            <BackButton onClick={() => navigate("/home")}/>
        </div>
    )
}
