import React from "react";
import {faCheckCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ISmurfIndicator} from "@/Interfaces";

export default function SmurfIndicator(props: {indicator: ISmurfIndicator})
{
    return (
        <div className="smurfIndicator">
                {props.indicator.smurf ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faTimesCircle} />}
                {props.indicator.text}
        </div>
    )
}