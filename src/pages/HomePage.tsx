import React, {useState} from "react"
import {Constants} from "twisted"

export default function HomePage()
{
    const [username, setUsername] = useState<string>("");
    const [region, setRegion] = useState<string>("na1");
    const [summonerNameWarning, setSummonerNameWarning] = useState<boolean>(false);

    // @ts-ignore
    const server_options = (Object.keys(Constants.Regions) as Array<keyof typeof Constants.Regions>).map((key) => <option key={key} value={key}>{Constants.Regions[key]}</option>)

    function checkSummoner() {
    }

    return (
        <div className="fullScreen">
            <div className='summonerSearchForm'>
                <label htmlFor='summonerName'>Summoner Name</label>
                {summonerNameWarning && <div className="warning">Could not acquire data from the API. Make sure your API key is accurate.</div>}
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
