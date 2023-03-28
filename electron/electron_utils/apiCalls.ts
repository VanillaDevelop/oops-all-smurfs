import {Constants, LolApi} from "twisted";

let LeagueApi : LolApi

export async function setApiKey(event, ...args)
{
    LeagueApi = new LolApi({key: args[0], rateLimitRetry: true, rateLimitRetryAttempts: 5, debug: {logRatelimits: true}})
}

export async function testApiKey(event, ...args) : Promise<boolean>
{
    //basic check to see if the api key is working, check status of EUW
    return await LeagueApi.StatusV4.get(Constants.Regions.EU_WEST).then((data) => true).catch((error) => false)
}

export async function getSummoner (event, ...args)
{
    return await LeagueApi.Summoner.getByName(args[0], Constants.Regions[args[1]]).then(data => data.response)
        .catch((error) => null)
}

export async function getSummonersPlayedWith(event, ...args)
{
    try {
        const matches = await LeagueApi.MatchV5.list(args[0], Constants.RegionGroups.EUROPE, {start: 0, count: 20})
            .then(data => data.response).catch((error) => null)

        if (matches == null)
            return null

        const matchPromises = matches.map((match) => {
            return LeagueApi.MatchV5.get(match, Constants.RegionGroups.EUROPE).then(data => data.response).catch((error) => {console.log(error); return null})
        })

        const matchDetails = await Promise.all(matchPromises);

        const summoners = new Set()

        for (const details of matchDetails) {
            if (details == null)
                continue
            // find the summoner in the match
            const summonerIdentity = details.info.participants.find(
                (player) => player.puuid === args[0]
            );
            //find the team of the summoner and whether they won or not.
            const summonerTeam = details.info.teams.find((team) => team.teamId === summonerIdentity.teamId);

            for (const participant of details.info.participants) {
                //if participant is on our team and not us, add them to the set
                const summonerData = {
                    participant: participant,
                    ally: participant.teamId === summonerTeam.teamId,
                    win: participant.teamId === summonerTeam.teamId ? summonerTeam.win : !summonerTeam.win
                }

                if(participant.puuid !== args[0]) {
                    summoners.add(summonerData);
                }
            }
        }

        return summoners;
    }
    catch (e) {
        console.log(e)
        return null;
    }
}