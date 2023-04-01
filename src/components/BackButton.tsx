import React from "react"
import "./BackButton.scss"
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function BackButton()
{
    return (
        <button className="backButton">
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
    )
}