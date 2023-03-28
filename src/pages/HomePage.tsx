import React, {useState, useContext} from "react"
import {Constants} from "twisted"
import {ipcRenderer} from "electron";
import {AppContext} from "@/context/AppContext";
import {useNavigate} from "react-router-dom";
import Warning from "@/components/Warning";
import LoadingBar from "@/components/LoadingBar";
import "./HomePage.scss"

export default function HomePage()
{
    const [username, setUsername] = useState<string>("");
    const [region, setRegion] = useState<string>("na1");
    const [warningText, setWarningText] = useState<string>("");
    const [loading, setLoading] = useState<number[]>([0,0,0]);

    const {setSummoner} = useContext(AppContext);
    const navigate = useNavigate();

    //no clue what kind of type hallucinations are going on here soooo...
    // @ts-ignore
    const server_options = (Object.keys(Constants.Regions) as Array<keyof typeof Constants.Regions>).map(
        (key)  => <option key={key} value={key}>{Constants.Regions[key]}</option>)

    async function checkSummoner() {
        setWarningText("")

        const summoner = await ipcRenderer.invoke('getSummoner', username, region)

        if (!summoner)
            return setWarningText("Could not find this summoner. Double-check the name and region.");
        setSummoner(summoner);

        const matches = await ipcRenderer.invoke('getSummonerMatches', summoner.puuid, region)
        if (!matches)
            return setWarningText("Could not find any matches for this summoner. Try again later.");

        setLoading([0, 0, matches.length])

        const matchDetails = []
        for (let i = 0; i < matches.length; i++) {
            const match = await ipcRenderer.invoke('getSummonerMatchDetails', matches[i], region)
            if (match !== null)
                matchDetails.push(match)
            setLoading([0, i, matches.length])
        }

        if (matchDetails.length === 0)
            return setWarningText("Could not find any match details. Try again later.");

        //const played_with = await ipcRenderer.invoke('getSummonersPlayedWith', summoner.puuid, region)

        //console.log(played_with)
        //navigate('/select_summoners')
    }

    return (
        <div className="container">
            <div className='summonerSearchForm'>
                <label htmlFor='summonerName'>Summoner Name</label>
                <Warning text={warningText} />
                <input type='text' id='api-key' value={username} onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor='region'>Region</label>
                <select id='region' value={region} onChange={(e) => setRegion(e.target.value)}>
                    {server_options}
                </select>
                <button onClick={checkSummoner}>Submit</button>
            </div>
            <div className="loadingContainer">
                {loading[1] !== loading[2] && <LoadingBar min={loading[0]} current={loading[1]} max={loading[2]}/>}
            </div>
        </div>
    )
}
