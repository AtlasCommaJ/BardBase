import React, {useState, useEffect, createRef, useCallback} from 'react';
import './Script.css'
import TextBlock from './TextBlock'
import Control from './Control'

function Script(props) {
    const {curPlay, curScene, handleSceneChange} = props;

    const [script, setScript] = useState([]);
    const [lineRefs, setLineRefs] = React.useState([]);
    const [focusLine,setFocusLine] = useState(-1);
    const [highlightCues, toggleHighlightCues] = useToggle("false");
    const [cueSheetMode, toggleCueSheetMode] = useToggle("false")

    const [curRole, setCurRole] = useState([])
    
    const handleRoleChange = useCallback((role) => {
        (curRole.includes(role)) ? setCurRole(curRole.filter(character => character !== role)) : setCurRole(curRole.concat(role))
    },[curRole]);

    useEffect(() => {
        setCurRole([])
    }, [curPlay])


    //either called by buttons or on click
    const handleScroll = useCallback((id,pos='center') => {
       if (!lineRefs[id] || !lineRefs[id].current)
           id = 0; 
       setFocusLine(id);
       lineRefs[id].current.scrollIntoView({ behavior: 'smooth', block: pos})
    }, [lineRefs]);

    //handles scroll via "NEXT" buttons
    const scrollToNext = useCallback((offset, pos) => { 
        for (let i = focusLine + 1 + offset; i < script.length; i++) {
            if (!curRole.length || curRole.includes(script[i].character)) {
                handleScroll(i-offset, pos);
                return;
            }
        }
        handleScroll(0,'start');
        setFocusLine(-1); 
    },[script, curRole, focusLine, handleScroll]);


    const condenseScript = useCallback((data) => {
        let result = [];
        let index = 0;
        while (index < data.length) {
            let block = {
                'id': result.length,
                'character': data[index].player,
                'text': [data[index].playerline]
            }
            index++;
            while (data[index] && block.character===data[index].player) {
                block.text.push(data[index].playerline)
                index++;
            }
            result.push(block);
        }
        setScript(result);
        let refs = []
        for (let i = 0; i < result.length; i++) 
            refs.push(createRef());
        setLineRefs(refs);
    }, [])


    useEffect(() => {
        const getLines = async () => {
            fetch(`https://p9hv9v5blg.execute-api.us-east-2.amazonaws.com/Primary/${curPlay}/${curScene}/lines`)
            .then(res => res.json())
            .then(res => {
                const data = JSON.parse(res);
                condenseScript(data)
            })
        }
        getLines()
        setFocusLine(-1)
    }, [curPlay,curScene, condenseScript])


    useEffect(() => {
        if (lineRefs[0])
            handleScroll(0,'start')
    },[lineRefs, handleScroll]);


    const getHighlightType = useCallback((idx) => {
        let res = ""
        if (idx===focusLine) {
            res += "focus";
        }
        if (curRole===[]) 
            return res
        if (curRole.includes(script[idx].character)) {
            res += "track";
            return res
        }
        if (!highlightCues && script[idx+1] && curRole.includes(script[idx+1].character)) {
            res += "cue";
        }
        return res;
    }, [focusLine, curRole, script, highlightCues]);




    const makeBlocks = useCallback(() => {
        const res = []
        let counter = 0
        for (let index = 0; index < script.length; index++) {
            const block = script[index]
            const id = block.id
            const character = block.character
            if (!cueSheetMode && !(getHighlightType(id)) && !(['ACT','SCENE'].includes(character))) {
                counter++;
            }
            else {
                if (counter > 0) {
                    res.push(<p> <TextBlock character={'DIRECTION'} text={[`[${counter} line(s) skipped]`]} specialBlockType={true}/> </p>);
                    counter = 0;
                }
                res.push(<p> <TextBlock handleScroll={() => handleScroll(id)} myRef={lineRefs[id]}
                                        character={character} text={block.text} 
                                        specialBlockType={['ACT','SCENE','DIRECTION'].includes(character)}
                                        highlightType={getHighlightType(id)}  /> 
                                        </p>);
            }
        }  
        return res;
    },[script, cueSheetMode,getHighlightType,handleScroll,lineRefs]);

    const print = useCallback(() => {
        window.print();
    },[]);


    return (
        <div className="allScript row">
           
            <div className="lines column">
                    <div className="scrollgap">
                        {makeBlocks()}
                    </div>
            </div>
            <div className="navigation column">
                <button className="panel" onClick={() => scrollToNext(0, 'center')}>NEXT LINE</button> <p />
                <button className="panel" onClick={() => scrollToNext(1, 'end')}>NEXT CUE </button> <p />
                <button className={!highlightCues ? 'panel selected' : 'panel'} onClick={toggleHighlightCues}>HIGHLIGHT CUES  </button> <p />
                <button className={!cueSheetMode  ? 'panel selected' : 'panel'} onClick={toggleCueSheetMode }>HIDE OTHER LINES</button> <p />
                <button className="panel" onClick={print}>PRINT</button>
            </div>
            <div className="control column">
                <Control    
                    curPlay={curPlay} curScene={curScene} curRole={curRole}
                    handleSceneChange={handleSceneChange} handleRoleChange={handleRoleChange}
                />
            </div>
        </div>
    )
}
export default Script;


function useToggle(initialValue = false) {
  const [value, setValue] = React.useState(initialValue);
  const toggle = React.useCallback(() => {
    setValue(v => !v);
  }, []);
  return [value, toggle];
}
