import React from "react";
import {Route, Routes} from "react-router-dom";
import KeyPage from "@/pages/KeyPage";
import EnterSummonerDataPage from "@/pages/EnterSummonerDataPage";
import OverviewPage from "@/pages/OverviewPage";
import SummonerDetails from "@/pages/SummonerDetails";
import LoadingSummonerPage from "@/pages/LoadingSummonerPage";

function App()
{
    return (
        <Routes>
            <Route path="/" element={<KeyPage />} />
            <Route path="/enter-summoner-data" element={<EnterSummonerDataPage />} />
            <Route path="/select-summoners" element={<OverviewPage />} />
            <Route path="/load-summoner/:puuid" element={<LoadingSummonerPage />} />
            <Route path="/summoner-details/:puuid" element={<SummonerDetails />} />
        </Routes>
    )
}

export default App
