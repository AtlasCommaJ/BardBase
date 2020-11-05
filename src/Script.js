import React, { useState, useEffect, createRef, useCallback } from "react";
import { useToggle } from "./hooks";
import "./Script.css";
import TextBlock from "./TextBlock";
import Control from "./Control";

const Script = (props) => {
  const {
    curPlay,
    curScene,
    curRole,
    handleSceneChange,
    handleRoleChange,
  } = props;

  const [script, setScript] = useState([]);
  const [lineRefs, setLineRefs] = React.useState([]);
  const [focusLine, setFocusLine] = useState(-1);

  const [highlightCues, toggleHighlightCues] = useToggle("false");
  const [cueSheetMode, toggleCueSheetMode] = useToggle("false");

  const isMobile = window.innerWidth <= 500;

  //either called by buttons or on click
  const handleScroll = useCallback(
    (id, pos = "center") => {
      if (!lineRefs[id] || !lineRefs[id].current) id = 0;
      setFocusLine(id);
      lineRefs[id].current.scrollIntoView({ behavior: "smooth", block: pos });
    },
    [lineRefs]
  );

  //handles scroll via "NEXT" buttons
  const scrollToNext = useCallback(
    (offset, pos) => {
      for (let i = focusLine + 1 + offset; i < script.length; i++) {
        if (!curRole.length || curRole.includes(script[i].character)) {
          handleScroll(i - offset, pos);
          return;
        }
      }
      handleScroll(0, "start");
      setFocusLine(-1);
    },
    [script, curRole, focusLine, handleScroll]
  );

  const condenseScript = useCallback((data) => {
    let result = [];
    let index = 0;
    while (index < data.length) {
      let block = {
        id: result.length,
        character: data[index].player,
        text: [data[index].playerline],
      };
      index++;
      while (data[index] && block.character === data[index].player) {
        block.text.push(data[index].playerline);
        index++;
      }
      result.push(block);
    }
    setScript(result);
    let refs = [];
    for (let i = 0; i < result.length; i++) refs.push(createRef());
    setLineRefs(refs);
  }, []);

  useEffect(() => {
    const getLines = async () => {
      fetch(
        `https://p9hv9v5blg.execute-api.us-east-2.amazonaws.com/Primary/${curPlay}/${curScene}/lines`
      )
        .then((res) => res.json())
        .then((res) => {
          const data = JSON.parse(res);
          condenseScript(data);
        });
    };
    getLines();
    setFocusLine(-1);
  }, [curPlay, curScene, condenseScript]);

  useEffect(() => {
    if (lineRefs[0] && !isMobile) handleScroll(0, "start");
  }, [lineRefs, handleScroll, isMobile]);

  const getHighlightType = useCallback(
    (idx) => {
      let res = "";
      if (idx === focusLine) res += "focus";
      if (curRole === []) return res;
      if (curRole.includes(script[idx].character)) res += "track";
      else if (
        !highlightCues &&
        script[idx + 1] &&
        curRole.includes(script[idx + 1].character)
      )
        res += "cue";
      return res;
    },
    [focusLine, curRole, script, highlightCues]
  );

  const makeBlocks = useCallback(() => {
    const blocks = [];
    let counter = 0;
    for (let index = 0; index < script.length; index++) {
      const block = script[index];
      const id = block.id;
      const character = block.character;
      if (
        !cueSheetMode &&
        !getHighlightType(id) &&
        !["ACT", "SCENE"].includes(character)
      ) {
        counter++;
      } else {
        if (counter > 0) {
          blocks.push(
            <p>
              <TextBlock
                character={"DIRECTION"}
                text={[`[${counter} line(s) skipped]`]}
                specialBlockType={true}
              />
            </p>
          );
          counter = 0;
        }
        blocks.push(
          <p>
            <TextBlock
              handleScroll={() => handleScroll(id)}
              myRef={lineRefs[id]}
              character={character}
              text={block.text}
              specialBlockType={["ACT", "SCENE", "DIRECTION"].includes(
                character
              )}
              highlightType={getHighlightType(id)}
            />
          </p>
        );
      }
    }
    return blocks;
  }, [script, cueSheetMode, getHighlightType, handleScroll, lineRefs]);

  const handleHideOtherLines = useCallback(() => {
    setFocusLine(-1);
    toggleCueSheetMode();
  }, [toggleCueSheetMode]);

  const print = useCallback(() => {
    window.print();
  }, []);

  return (
    <div
      className="allScript"
      style={{ flexDirection: isMobile ? "column" : "row" }}
    >
      {!isMobile && (
        <div className="lines box">
          <div className="scrollgap">{makeBlocks()}</div>
        </div>
      )}

      {isMobile && (
        <div className="control box">
          <Control
            curPlay={curPlay}
            curScene={curScene}
            curRole={curRole}
            handleSceneChange={handleSceneChange}
            handleRoleChange={handleRoleChange}
          />
        </div>
      )}

      <div className="navigation box">
        {!isMobile && (
          <div>
            <button className="panel" onClick={() => scrollToNext(0, "center")}>
              NEXT LINE
            </button>
            <p />
            <button className="panel" onClick={() => scrollToNext(1, "end")}>
              NEXT CUE
            </button>
            <p />
          </div>
        )}
        <button
          className={!highlightCues ? "panel selected" : "panel"}
          onClick={toggleHighlightCues}
        >
          HIGHLIGHT CUES
        </button>
        <p />
        <button
          className={!cueSheetMode ? "panel selected" : "panel"}
          onClick={handleHideOtherLines}
        >
          HIDE OTHER LINES
        </button>
        <p />
        <button className="panel" onClick={print}>
          PRINT
        </button>
      </div>

      {!isMobile && (
        <div className="control box">
          <Control
            curPlay={curPlay}
            curScene={curScene}
            curRole={curRole}
            handleSceneChange={handleSceneChange}
            handleRoleChange={handleRoleChange}
          />
        </div>
      )}

      {isMobile && (
        <div className="lines box">
          <div className="scrollgap">{makeBlocks()}</div>
          <div className="mobileNav">
            <button
              className="mobile"
              onClick={() => scrollToNext(0, "center")}
            >
              NEXT LINE
            </button>
            <p />
            <button className="mobile" onClick={() => scrollToNext(1, "end")}>
              NEXT CUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Script;
