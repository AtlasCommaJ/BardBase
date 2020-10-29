import React from "react";
import "./TextBlock.css";

const TextBlock = (props) => {
    const {
        handleScroll,
        myRef,
        highlightType,
        specialBlockType,
        character,
        text
    } = props;

  return (
    <div className="block" onClick={handleScroll} ref={myRef}>
      <div className={highlightType}>
        <span className="character">
          {!specialBlockType && character.toUpperCase()}
        </span>
        <span className={(specialBlockType && character) || "text"}>
          {text.map((line) => (
            <div>{line}</div>
          ))}
        </span>
      </div>
    </div>
  );
};

export default TextBlock;
