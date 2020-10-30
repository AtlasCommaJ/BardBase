import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Script from "./Script";

const App = () => {
  const [plays, setPlays] = useState([]);
  const [curPlay, setCurPlay] = useState("ham");
  const [curScene, setCurScene] = useState("1.1");
  const [fullNames, setFullNames] = useState({});

  useEffect(() => {
    const getPlays = async () => {
      fetch("https://p9hv9v5blg.execute-api.us-east-2.amazonaws.com/Primary")
        .then((res) => res.json())
        .then((res) => {
          const data = JSON.parse(res);
          let result = [[" Histories"], ["Tragedies"], ["Comedies"]];
          let dict = {};
          for (let item of data) {
            dict[item.abbreviation] = item.play;
            result[item.genrecode].push(item.abbreviation);
          }
          setPlays(result);
          setFullNames(dict);
        });
    };
    getPlays();
  }, []);

  const handlePlayChange = useCallback((play) => {
    setCurPlay(play);
    setCurScene("1.1");
  }, []);

  const handleSceneChange = useCallback((scene) => {
    setCurScene(scene);
  }, []);

  const isMobile = window.innerWidth <= 500;

  return (
    <div className="allApp box">
      <div className="header" style={{ flexDirection: isMobile ? "column" : "row" }}>
        <div className="title box">
          <span className="bardbase">BardBase</span>
          <p />
          {fullNames[curPlay]}
          <br />
          {curScene === "_" ? null : `Act ${curScene.split(".")[0]}, Scene ${curScene.split(".")[1]}`}
        </div>
        <div className="plays box">
          <table>
            {plays.map((genre, i) => (
              <tr>
                <td> {genre[0]}: </td>
                <td>
                  <span className="genres">
                    {genre.slice(1).map((play) => (
                      <button className={play === curPlay ? "selected" : genre[0]} onClick={() => handlePlayChange(play)}>
                        {fullNames[play]}
                      </button>
                    ))}
                  </span>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
      <div className="script">
        <Script
          curPlay={curPlay}
          curScene={curScene}
          handleSceneChange={handleSceneChange}
        />
      </div>
      <span className="credit">
        Created by Jamie Atlas. Version 1.2. Send feedback, comments, notes, errors to AtlasCommaJ@gmail.com. <br/>
        
      </span>
    </div>
  );
};

export default App;
