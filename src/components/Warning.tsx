import React from 'react';
import './Warning.scss';

export default function Warning({text} : {text: string}) {
    if (text === '') {
        return null;
    }

    return (
        <div className="warning">
            {text}
        </div>
    );
}