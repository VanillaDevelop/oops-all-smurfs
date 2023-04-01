import React from "react";
import {MatchV5DTOs, SummonerV4DTO} from "twisted/dist/models-dto";

export interface IAppContext {
    summoner: SummonerV4DTO;
    setSummoner: React.Dispatch<React.SetStateAction<SummonerV4DTO>>;
    matches: MatchV5DTOs.MatchDto[];
    setMatches : React.Dispatch<React.SetStateAction<MatchV5DTOs.MatchDto[]>>;
}

export interface ISuspiciousSummoner {
    summoner: MatchV5DTOs.ParticipantDto,
    matchId: number,
    flagged: boolean,
    ally: boolean,
    won: boolean
}