 import React from 'react';

function NavElement(props) {
    const content = props.content;
    const isClicked = props.selected;
    const theme = props.theme;
    //pass content to the prop's handle click function
    function handleClick() {
        props.onClick(content);
    }
    return (
        <div className="nav-element"
        style={{color: isClicked? theme.main : theme.correct}} 
        onClick={handleClick}>
            <h3>{content}</h3>
        </div>
    )
}

export default NavElement;