import React from 'react';
import './LoadingBar.scss';

export default function LoadingBar({ min, current, max} : {min: number; current: number; max: number;})
{
    const percentage = ((current - min) / (max - min)) * 100;

    return (
        <div className="loading-bar-container">
            <div
                className="loading-bar"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};