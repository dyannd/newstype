import React from 'react';

function Loading(props) {
    let theme = props.theme;
    return (
        <div className="loader">
            <div className="loader-dot" style={{background: theme.wrong}}>
            </div>
            <div className="loader-dot" style={{background: theme.wrong}}>
            </div>
            <div className="loader-dot" style={{background: theme.wrong}}>
            </div>
            <div className="loader-dot" style={{background: theme.wrong}}>
            </div>
        </div>
    )
}

export default Loading;