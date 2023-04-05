import React from "react";
import {MatchV5DTOs} from "twisted/dist/models-dto";

export default function RecentMatch(props: {match: MatchV5DTOs.MatchDto, summoner_id: string})
{
    const player = props.match.info.participants.find(p => p.puuid === props.summoner_id)!
    const player_role = player.individualPosition[0] + player.individualPosition.substring(1, player.individualPosition.length).toLowerCase()

    return (
        <div key={props.match.metadata.matchId}>
            {player.championName} {player_role} <br />
            {player.kills} / {player.deaths} / {player.assists} <br />
        </div>
    )
}