import React from "react";
import {faExclamationCircle, faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ISmurfIndicator} from "@/Interfaces";
import "./SmurfIndicator.scss"

export default function SmurfIndicator(props: {indicator: ISmurfIndicator})
{
    return (
        <div className={`smurfIndicator ${props.indicator.smurf ? "smurfIndicatorTrue" : "smurfIndicatorFalse"}`}>
            <span className="smurfIndicatorIcon">
                {props.indicator.smurf ? <FontAwesomeIcon icon={faExclamationCircle} /> : <FontAwesomeIcon icon={faCheckCircle} />}
            </span>
            <span className="smurfIndicatorText">
                {props.indicator.text}
            </span>
        </div>
    )
}