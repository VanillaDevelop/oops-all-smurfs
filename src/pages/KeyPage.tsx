import './KeyPage.scss';
import React, {useState} from "react";
import {ipcRenderer} from "electron";
import {testApiKey} from "../../electron/electron_utils/apiCalls";
import {useNavigate} from "react-router-dom";

function KeyPage()
{
    const [apiKey, setApiKey] = useState<string>("");
    const [keyWarning, setKeyWarning] = useState<boolean>(false);
    const navigate = useNavigate();

    async function checkApiKey()
    {
        await ipcRenderer.invoke('setApiKey', apiKey);
        if(await ipcRenderer.invoke('testApiKey') == true)
        {
            navigate('/home')
        }
        else
        {
            setKeyWarning(true)
        }
    }

    return (
        <div className="container">
            <h1>Oops, all smurfs!</h1>
            <h2>Explore the epic depths of League of Legends' smurf queue.</h2>
            <div className='api-key-form'>
                <label htmlFor='api-key'>To begin, enter a valid Riot Games API key below.</label>
                {keyWarning && <div className="warning">Could not acquire data from the API. Make sure your API key is accurate.</div>}
                <input type='text' id='api-key' value={apiKey} onChange={(e) => setApiKey(e.target.value)}/>
                <button onClick={checkApiKey}>Submit</button>
            </div>
        </div>
    )
}

export default KeyPage
