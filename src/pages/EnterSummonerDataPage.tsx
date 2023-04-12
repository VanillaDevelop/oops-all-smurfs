import React, {useState, useContext} from "react"
import {Constants} from "twisted"
import {ipcRenderer} from "electron";
import {AppContext} from "@/context/AppContext";
import {useNavigate} from "react-router-dom";
import Warning from "@/components/Warning";
import LoadingBar from "@/components/LoadingBar";
import {ISuspiciousSummoner} from "@/Interfaces";
import {MatchV5DTOs} from "twisted/dist/models-dto";

export default function EnterSummonerDataPage()
{
    const [username, setUsername] = useState<string>("");
    const [region, setRegion] = useState<string>("EU_WEST");
    const [warningText, setWarningText] = useState<string>("");
    const [loading, setLoading] = useState<number[]>([0,0,0]);

    const {setSummoner, setMatches, setSuspiciousSummoners} = useContext(AppContext);
    const navigate = useNavigate();

    const server_options = (Object.keys(Constants.Regions) as Array<keyof typeof Constants.Regions>).map(
        (key)  => <option key={key} value={key}>{key.replace("_", " ")}</option>)

    async function checkSummoner() {
        setWarningText("")

        const summoner = await ipcRenderer.invoke('getSummoner', username, region)

        if (!summoner)
            return setWarningText("Could not find this summoner. Double-check the name and region.");
        setSummoner(summoner);

        const matches = await ipcRenderer.invoke('getSummonerMatches', summoner.puuid)
        if (!matches)
            return setWarningText("Could not find any matches for this summoner. Try again later.");

        setLoading([0, 0, matches.length])

        const matchDetails = []
        for (let i = 0; i < matches.length; i++) {
            const match = await ipcRenderer.invoke('getSummonerMatchDetails', matches[i])
            if (match !== null)
                matchDetails.push(match)
            setLoading([0, i, matches.length])
        }

        if (matchDetails.length === 0)
            return setWarningText("Could not find any match details. Try again later.");

        setMatches(matchDetails)

        const suspicious = matchDetails.map(match => {
            return match.info.participants.map((participant: MatchV5DTOs.ParticipantDto) => {
                if (participant.summonerLevel >= 50 || participant.summonerLevel < 30) return null;
                const user_team = match.info.participants.find((participant: MatchV5DTOs.ParticipantDto) => participant.summonerName === summoner.name);
                return {
                    matchId: match.info.gameId,
                    summoner: participant,
                    flagged: false,
                    ally: participant.teamId === user_team?.teamId,
                    won: participant.teamId === user_team?.teamId ? user_team?.win : !user_team?.win}
            }).filter((x: MatchV5DTOs.MatchDto) => x !== null)
        }).flat() as ISuspiciousSummoner[]
        setSuspiciousSummoners(suspicious)

        navigate('/select-summoners')
    }

    return (
        <div className="container flex-col-center">
            <div className='summonerSearchForm'>
                <label htmlFor='summonerName'>Summoner Name</label>
                <Warning text={warningText} />
                <input type='text' id='api-key' value={username} onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor='region'>Region</label>
                <select id='region' value={region} onChange={(e) => setRegion(e.target.value)}>
                    {server_options}
                </select>
                <button disabled={loading[0] != loading[2]} onClick={checkSummoner}>Submit</button>
            </div>
            <div>
                {loading[1] !== loading[2] && <LoadingBar min={loading[0]} current={loading[1]} max={loading[2]}/>}
            </div>
        </div>
    )
}
