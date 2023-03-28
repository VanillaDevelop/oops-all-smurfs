import React, {useState, useContext} from "react"
import {Constants} from "twisted"
import {ipcRenderer} from "electron";
import {AppContext} from "@/context/AppContext";
import {useNavigate} from "react-router-dom";

export default function HomePage()
{
    const [username, setUsername] = useState<string>("");
    const [region, setRegion] = useState<string>("na1");
    const [summonerNameWarning, setSummonerNameWarning] = useState<boolean>(false);

    const {setSummoner} = useContext(AppContext);
    const navigate = useNavigate();

    //no clue what kind of type hallucinations are going on here soooo...
    // @ts-ignore
    const server_options = (Object.keys(Constants.Regions) as Array<keyof typeof Constants.Regions>).map(
        (key)  => <option key={key} value={key}>{Constants.Regions[key]}</option>)

    async function checkSummoner() {
        const summoner = await ipcRenderer.invoke('getSummoner', username, region)

        if (!summoner)
            return setSummonerNameWarning(true);
        setSummoner(summoner);

        const played_with = await ipcRenderer.invoke('getSummonersPlayedWith', summoner.puuid, region)

        if (!played_with)
            return setSummonerNameWarning(true);

        console.log(played_with)
        navigate('/home/profile')
    }

    return (
        <div className="container">
            <div className='summonerSearchForm'>
                <label htmlFor='summonerName'>Summoner Name</label>
                {summonerNameWarning && <div className="warning">Could not acquire summoner. Double-check the name and region.</div>}
                <input type='text' id='api-key' value={username} onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor='region'>Region</label>
                <select id='region' value={region} onChange={(e) => setRegion(e.target.value)}>
                    {server_options}
                </select>
                <button onClick={checkSummoner}>Submit</button>
            </div>
        </div>
    )
}
