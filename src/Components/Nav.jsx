import React, { useState, useEffect, useRef } from 'react';
import NavElement from "./NavElement";
function NavBar(props) {
    const [option, setOption] = useState("30");
    const theme = props.theme;

    //handle click from each nav element (option)
    function handleClick(option) {
        setOption(option);
    }

    //pass back to parent
    useEffect(() => {
        props.changeOption(option);
    }, [option])

    return (
        <section id="NavBar" className="nav-bar">
            <div className="logo">
                <h1 style={{ color: theme.correct }}><span style={{ color: theme.main }}>wanna</span>type?</h1>
            </div>
            <div className="nav-elements-holder">
                <NavElement
                    selected={option === "30" ? true : false}
                    content="30"
                    theme={theme}
                    onClick={handleClick} />
                <NavElement
                    selected={option === "60" ? true : false}
                    content="60"
                    theme={theme}
                    onClick={handleClick} />
                <NavElement
                    selected={option === "120" ? true : false}
                    content="120"
                    theme={theme}
                    onClick={handleClick} />
            </div>
        </section>
    )
}

export default NavBar;