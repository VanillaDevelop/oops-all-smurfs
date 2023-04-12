import React from "react";
import {MatchV5DTOs} from "twisted/dist/models-dto";
import "./RecentMatch.scss";

export default function RecentMatch(props: {match: MatchV5DTOs.MatchDto, summoner_id: string})
{
    const player = props.match.info.participants.find(p => p.puuid === props.summoner_id)!
    const player_role = player.individualPosition[0] + player.individualPosition.substring(1, player.individualPosition.length).toLowerCase()
    const player_team = props.match.info.teams.find(t => t.teamId === player.teamId)!

    return (
        <div key={props.match.metadata.matchId} className={`recentMatch ${player_team.win ? "matchWin" : "matchLoss"}`}>
            <div className="winLossIndicator">
                {player_team.win ? "WIN" : "LOSS"}
            </div>
            {player.championName} {player_role} <br />
            {player.kills} / {player.deaths} / {player.assists} <br />
        </div>
    )
}