import React from "react"
import {MatchV5DTOs} from "twisted/dist/models-dto";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export default function PlayerDisplay(props: {match: MatchV5DTOs.MatchDto, player: MatchV5DTOs.ParticipantDto,
    player_team: number})
{

    const player_role = props.player.individualPosition[0]
        + props.player.individualPosition.substring(1, props.player.individualPosition.length).toLowerCase()

    const is_ally = props.player.teamId === props.player_team;

    const player_team = props.match.info.teams.find((team) => team.teamId === props.player.teamId);

    return (
        <div className={`profile`}>
            <span className="profileType"> {props.player.teamId === props.player_team ? "Ally" : "Enemy"} - {player_team?.win ? "Won" : "Lost"} </span>
            <div className={`playerInfo  ${is_ally ? "ally" : "enemy"}`}>
                <div className="smurfMark">
                    <FontAwesomeIcon icon={faStar} />
                </div>
                <strong>{props.player.summonerName}</strong> (Level {props.player.summonerLevel}) <br />
                {props.player.championName} {player_role} <br />
                {props.player.kills} / {props.player.deaths} / {props.player.assists} <br />
                {// @ts-ignore (dunno why this is not on the Dto)
                    props.player.baitPings} bait pings, {props.player.enemyMissingPings} enemy missing pings <br />
            </div>
        </div>
    )
}