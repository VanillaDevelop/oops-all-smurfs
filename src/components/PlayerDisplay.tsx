import React from "react"
import {MatchV5DTOs} from "twisted/dist/models-dto";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ISuspiciousSummoner} from "@/Interfaces";
import "./PlayerDisplay.scss"
import {useNavigate} from "react-router-dom";


export default function PlayerDisplay(props: {player: ISuspiciousSummoner, match: MatchV5DTOs.MatchDto})
{
    const player_role = props.player.summoner.individualPosition[0]
        + props.player.summoner.individualPosition.substring(1, props.player.summoner.individualPosition.length).toLowerCase()

    const navigate = useNavigate()

    return (
        <div className={`profile`}>
            <span className="profileType"> {props.player.ally ? "Ally" : "Enemy"} - {props.player.won ? "Won" : "Lost"} </span>
            <div className={`playerInfo  ${props.player.ally ? "ally" : "enemy"}`} onClick={() => navigate("/load-summoner/" + props.player.summoner.puuid)}>
                <div className="smurfMark">
                    {(props.player.data) && <FontAwesomeIcon icon={faStar} />}
                </div>
                <strong>{props.player.summoner.summonerName}</strong> (Level {props.player.summoner.summonerLevel}) <br />
                {props.player.summoner.championName} {player_role} <br />
                {props.player.summoner.kills} / {props.player.summoner.deaths} / {props.player.summoner.assists} <br />
                {// @ts-ignore (dunno why this is not on the Dto)
                    props.player.summoner.baitPings} bait pings, {props.player.summoner.enemyMissingPings} enemy missing pings <br />
            </div>
        </div>
    )
}