import React from 'react';

export default function Warning(props: { text: string; }) {
    const { text } = props;

    if (text === '') {
        return null;
    }

    return (
        <div className="warning">
            {text}
        </div>
    );
}