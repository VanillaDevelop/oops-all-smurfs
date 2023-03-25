import './App.scss';
import React, {useState} from "react";
import {LolApi, Constants} from "twisted";
import {ipcRenderer} from "electron";

function App() {
    const [apiKey, setApiKey] = useState<string>("");

    function changeApiKey(key: string)
    {
        setApiKey(key);
    }

    function checkApiKey()
    {
        const summoner = ipcRenderer.invoke('testApi', apiKey, "Vanilla Nya").then((res) => {
            console.log(res);
        })
    }

    return (
        <div className='App'>
            <h1>Oops, all smurfs!</h1>
            <h2>Explore the epic depths of League of Legends' smurf queue.</h2>
            <div className='api-key-form'>
                <label htmlFor='api-key'>To begin, enter a valid Riot Games API key below.</label>
                <input type='text' id='api-key' value={apiKey} onChange={(e) => setApiKey(e.target.value)}/>
                <button onClick={checkApiKey}>Submit</button>
            </div>
        </div>
    )
}

export default App
