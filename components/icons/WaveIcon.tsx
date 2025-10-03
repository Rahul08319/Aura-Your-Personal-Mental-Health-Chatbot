import React from 'react';

const WaveIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8Q6 4, 8 8T12 8T16 8T20 8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12Q6 8, 8 12T12 12T16 12T20 12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16Q6 12, 8 16T12 16T16 16T20 16" />
    </svg>
);

export default WaveIcon;