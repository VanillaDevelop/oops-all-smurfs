import React from "react";
import {faCheckCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function SmurfIndicator(props: {smurf:boolean, text:string})
{
    return (
        <div className="smurfIndicator">
                {props.smurf ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faTimesCircle} />}
                {props.text}
        </div>
    )
}