import React from "react";
import {Route, Routes} from "react-router-dom";
import KeyPage from "@/pages/KeyPage";
import HomePage from "@/pages/HomePage";
import SelectSummonersPage from "@/pages/SelectSummonersPage";

function App()
{
    return (
        <Routes>
            <Route path="/" element={<KeyPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/select-summoners" element={<SelectSummonersPage />} />
        </Routes>
    )
}

export default App
