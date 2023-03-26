import {Constants, LolApi} from "twisted";

let LeagueApi : LolApi

export async function setApiKey(event, ...args)
{
    LeagueApi = new LolApi(args[0])
}

export async function testApiKey(event, ...args) : Promise<boolean>
{
    //basic check to see if the api key is working, check status of EUW
    return await LeagueApi.StatusV4.get(Constants.Regions.EU_WEST).then((data) => true).catch((error) => false)
}

export async function getSummoner (event, ...args)
{
    const LeagueApi = new LolApi(args[0])
    return await LeagueApi.Summoner.getByName(args[1], Constants.Regions.EU_WEST).catch((error) => null)
}