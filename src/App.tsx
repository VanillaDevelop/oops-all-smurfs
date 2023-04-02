import React from "react";
import {Route, Routes} from "react-router-dom";
import KeyPage from "@/pages/KeyPage";
import HomePage from "@/pages/HomePage";
import SelectSummonersPage from "@/pages/SelectSummonersPage";
import SummonerDetails from "@/pages/SummonerDetails";
import LoadingSummonerPage from "@/pages/LoadingSummonerPage";

function App()
{
    return (
        <Routes>
            <Route path="/" element={<KeyPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/select-summoners" element={<SelectSummonersPage />} />
            <Route path="/load-summoner/:puuid" element={<LoadingSummonerPage />} />
            <Route path="/summoner-details/:puuid" element={<SummonerDetails />} />
        </Routes>
    )
}

export default App
