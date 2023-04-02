import {Constants, LolApi} from "twisted";

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

export async function getSummonerMatches (event, puuid: string)
{
    return await LeagueApi.MatchV5.list(puuid, Constants.RegionGroups.EUROPE, {start: 0, count: 20})
        .then(data => data.response).catch((error) => null)
}

export async function getSummonerMatchDetails(event, match : string)
{
    return await LeagueApi.MatchV5.get(match, Constants.RegionGroups.EUROPE).then(data => data.response).catch((error) => null)
}