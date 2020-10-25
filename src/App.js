import React, { useState, useEffect, useCallback} from 'react';
import './App.css';
import Script from './Script';


function App() {

    const [plays, setPlays] = useState([]);
    const [curPlay,setCurPlay] = useState("ham")
    const [curScene,setCurScene] = useState("1.1")
    
    const [fullNames, setFullNames] = useState({})

    

     useEffect(() => {
        const getPlays = async () => {
            fetch('https://p9hv9v5blg.execute-api.us-east-2.amazonaws.com/Primary')
            .then(res => res.json())
            .then(res => {
                const data = JSON.parse(res)
                let result = [[" Histories"],["Tragedies"],["Comedies"]]
                let dict = {};
                for (let item of data) {
                    dict[item.abbreviation] = item.play
                    result[item.genrecode].push(item.abbreviation);
                }
                setPlays(result);
                setFullNames(dict);
            });
        }
        getPlays();
    }, []);

    const handlePlayChange = useCallback((play) => {
        setCurPlay(play);
        setCurScene("1.1");
    },[])

    const handleSceneChange = useCallback((scene) => {
        setCurScene(scene)
    },[])

    return ( 
        <div className="allApp column">
            <div className="header row">
                <div className="title column">
                    <b><em>BardBase</em></b><p /> 
                    {fullNames[curPlay]}{curScene==='_' ? null : ` - ${curScene}`}
                </div>
                <div className="plays column">
                    {plays.map((genre,i) => <div> {genre[0]}: <span className="genres"> {genre.slice(1).map(play => 
                                                                    <button className={(play === curPlay) ? "selected" : genre[0]} 
                                                                            onClick={() => handlePlayChange(play)}> 
                                                                            {fullNames[play]} </button> )} </span> </div>)}
                </div>
            </div>
            <div className="script row">
                <Script curPlay={curPlay} curScene={curScene} handleSceneChange={handleSceneChange}  />
            </div>
           <span style={{'position': 'fixed', 'right': '10px', 'bottom': '18px'}}>Created by Jamie Atlas. Version 1.0</span>
        </div>
    );
}


export default App;

