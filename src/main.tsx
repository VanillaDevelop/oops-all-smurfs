import React from 'react'
import ReactDOM from 'react-dom/client'
import {HashRouter as Router} from 'react-router-dom'
import {AppContextProvider} from "@/context/AppContext";
import App from './App'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Router>
        <React.StrictMode>
            <AppContextProvider>
                <App/>
            </AppContextProvider>
        </React.StrictMode>
    </Router>)

postMessage({payload: 'removeLoading'}, '*')
