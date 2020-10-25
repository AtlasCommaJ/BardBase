import React from "react";
import './TextBlock.css';


function TextBlock(props) {

    return (
        <div className="block" onClick={props.handleScroll} ref={props.myRef}>
            <div className={props.highlightType}>
                <span className="character"> {!props.specialBlockType && props.character.toUpperCase()} </span>
                <span className={(props.specialBlockType && props.character) || "text"}> {props.text.map(line => <div> {line} </div>)} </span>
            </div>
        </div>
    )
}

export default TextBlock;

