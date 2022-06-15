import React from 'react';

function Result(props) {
    const { wpm, acc, theme } = props;
    return (
        <div className="result">
            <div>
                <div className="result-subdata" style={{color: theme.correct}}>
                    <i className="fa-solid fa-gauge-high icon"></i><h3> WPM</h3>
                </div>
                <div className="result-subdata">
                    <h1>{wpm}</h1>
                </div>
            </div>
            <div>
                <div className="result-subdata" style={{color: theme.correct}}>
                    <i className="fa-solid fa-bullseye icon"></i><h3>ACCURACY</h3>
                </div>
                <div className="result-subdata">
                    <h1>{acc + " %"}</h1>
                </div>
            </div>
        </div>

    )
}

export default Result;