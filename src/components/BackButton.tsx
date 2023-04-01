import React from "react"
import "./BackButton.scss"
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function BackButton(props: { onClick: () => void })
{
    return (
        <button className="backButton" onClick={props.onClick}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
    )
}