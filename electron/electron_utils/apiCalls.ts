import {Constants, LolApi} from "twisted";
import {MatchV5DTOs} from "twisted/dist/models-dto";

let LeagueApi : LolApi

export async function setApiKey(event, key)
{
    LeagueApi = new LolApi({key, rateLimitRetry: true, rateLimitRetryAttempts: 5, debug: {logRatelimits: true}})
}

export async function testApiKey(event) : Promise<boolean>
{
    //basic check to see if the api key is working, check status of EUW
    return await LeagueApi.StatusV4.get(Constants.Regions.EU_WEST).then((data) => true).catch((error) => false)
}

export async function getSummoner (event, summoner_name: string, region: string)
{
    return await LeagueApi.Summoner.getByName(summoner_name, Constants.Regions[region]).then(data => data.response)
        .catch((error) => null)
}

export async function getSummonerMatches (event, puuid: string, region: string)
{
    return await LeagueApi.MatchV5.list(puuid, Constants.RegionGroups.EUROPE, {start: 0, count: 20})
        .then(data => data.response).catch((error) => null)
}

export async function getSummonerMatchDetails(event, match : string)
{
    return await LeagueApi.MatchV5.get(match, Constants.RegionGroups.EUROPE).then(data => data.response).catch((error) => null)
}

export async function getSummonersPlayedWith(event, puuid: string, region: string, match : MatchV5DTOs.MatchDto) {
    const summoners = []

    // find the summoner in the match
    const summonerIdentity = match.info.participants.find(
        (player) => player.puuid === puuid
    );
    //find the team of the summoner and whether they won or not.
    const summonerTeam = match.info.teams.find((team) => team.teamId === summonerIdentity.teamId);

    for (const participant of match.info.participants) {
        //skip if participant is us
        if (participant.puuid === puuid) {
            continue;
        }

        //if participant is on our team and not us, add them to the set
        const summonerData = {
            participant: participant,
            ally: participant.teamId === summonerTeam.teamId,
            win: participant.teamId === summonerTeam.teamId ? summonerTeam.win : !summonerTeam.win,
            details: null
        }

        summoners.push(summonerData);
    }
    return summoners;
}