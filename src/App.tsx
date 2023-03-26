import React from "react";
import {Route, Routes} from "react-router-dom";
import KeyPage from "@/pages/KeyPage";
import HomePage from "@/pages/HomePage";

function App()
{
    return (
        <Routes>
            <Route path="/" element={<KeyPage />} />
            <Route path="/home" element={<HomePage />} />
        </Routes>
    )
}

export default App
