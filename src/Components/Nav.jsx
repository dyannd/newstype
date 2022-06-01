import React, { useState, useEffect, useRef } from 'react';
import NavElement from "./NavElement";
function NavBar()   {
    const [option, setOption] = useState("30");

    //handle click from each nav element (option)
    function handleClick (option){
        setOption(option);
    }

    return(
        <section id="NavBar" className="nav-bar">
            <div className="logo">
                <h1><span>news</span>type</h1>
            </div>
            <div className="nav-elements-holder">
                <NavElement selected={option==="30"?true:false} content="30" 
                    onClick={handleClick}/>
                <NavElement selected={option==="60"?true:false} content="60" 
                    onClick={handleClick}/>
                <NavElement selected={option==="120"?true:false} content="120" 
                    onClick={handleClick}/>
            </div>
        </section>
    )
}

export default NavBar;