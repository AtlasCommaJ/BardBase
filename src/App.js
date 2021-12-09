import React, { useState, useEffect, useCallback } from "react";
import { usePersistentState, useComplexPersistentState } from "./hooks";
import "./App.css";
import Script from "./Script";
import twitter from "./assets/twitter.png";
import github from "./assets/github.png";

// import Amplify, { Analytics } from "aws-amplify";
// import awsconfig from "./aws-exports";
// Amplify.configure(awsconfig);

const App = () => {
  const [plays, setPlays] = useState([]);
  const [fullNames, setFullNames] = useState({});

  const [curPlay, setCurPlay] = usePersistentState("play", "ham");
  const [curScene, setCurScene] = usePersistentState("scene", "1.1");
  const [curRole, setCurRole] = useComplexPersistentState("role", []);

  useEffect(() => {
    const getPlays = async () => {
      fetch("data/plays.json")
        .then((res) => res.json())
        .then((data) => {
          let result = [
            ["Histories"],
            ["Tragedies"],
            ["Comedies"],
            ["Romances"],
          ];
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

  const handlePlayChange = useCallback(
    (play) => {
      setCurPlay(play);
      setCurScene("1.1");
      setCurRole([]);
      // Analytics.record({
      //   name: "play",
      //   attributes: { title: play },
      // });
    },
    [setCurPlay, setCurScene, setCurRole]
  );

  const handleSceneChange = useCallback(
    (scene) => {
      setCurScene(scene);
    },
    [setCurScene]
  );

  const handleRoleChange = useCallback(
    (role) => {
      curRole.includes(role)
        ? setCurRole(curRole.filter((character) => character !== role))
        : setCurRole(curRole.concat(role));
    },
    [curRole, setCurRole]
  );

  const isMobile = window.innerWidth <= 500;

  return (
    <div className="allApp box">
      <div
        className="header"
        style={{ flexDirection: isMobile ? "column" : "row" }}
      >
        <div className="title box">
          <br />
          <span className="bardbase">BardBase</span>
          <p />
          {fullNames[curPlay]}
          <br />
          {curScene === "_"
            ? null
            : `Act ${curScene.split(".")[0]}, Scene ${curScene.split(".")[1]}`}
        </div>
        <div className="plays box">
          <table>
            <tbody>
              {plays.map((genre, i) => (
                <tr key={i}>
                  <td> {genre[0]}: </td>
                  <td>
                    <span className="genres">
                      {genre.slice(1).map((play, j) => (
                        <button
                          className={play === curPlay ? "selected" : genre[0]}
                          onClick={() => handlePlayChange(play)}
                          key={j}
                        >
                          {fullNames[play]}
                        </button>
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="script">
        <Script
          curPlay={curPlay}
          curScene={curScene}
          curRole={curRole}
          handleSceneChange={handleSceneChange}
          handleRoleChange={handleRoleChange}
        />
      </div>
      <div className="credit">
        Created by James Atlas. Version 1.4. Send feedback, comments, notes,
        errors to AtlasCommaJ@gmail.com.
        <a
          href="https://github.com/AtlasCommaJ/BardBase"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={github} alt="github link" />
        </a>
        <a
          href="https://twitter.com/AlasJetsam"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={twitter} alt="twitter link" />
        </a>
        <br />
        Text retrieved from the
        <a
          href="https://shakespeare.folger.edu/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: 4, marginRight: 4 }}
        >
          Folger Shakespeare Library
        </a>
        under a
        <a
          href="https://creativecommons.org/licenses/by-nc/3.0/deed.en_US"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: 4 }}
        >
          Creative Commons Attribution-NonCommercial 3.0 Unported license
        </a>
        .
      </div>
    </div>
  );
};

export default App;
