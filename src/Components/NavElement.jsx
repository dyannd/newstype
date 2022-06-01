 import React, { useState, useEffect, useRef } from 'react';

function NavElement(props) {
    const content = props.content;
    const isClicked = props.selected;

    //pass content to the prop's handle click function
    function handleClick() {
        props.onClick(content);
    }
    return (
        <div className={isClicked?"nav-element selected":"nav-element"} 
        onClick={handleClick}>
            <h3>{content}</h3>
        </div>
    )
}

export default NavElement;