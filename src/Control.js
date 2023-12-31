import React, { useState, useEffect } from "react";

const Control = (props) => {
  const { curPlay, curScene, curRole, handleSceneChange, handleRoleChange } =
    props;

  const [scenes, setScenes] = useState([]);
  const [fullCast, setFullCast] = useState([]);
  const [sceneCast, setSceneCast] = useState([]);

  useEffect(() => {
    const getSceneCast = async () => {
      fetch(`data/${curPlay}/script/${curScene}.json`)
        .then((res) => res.json())
        .then((data) => {
          let players = [];
          for (let r of data) {
            if (
              !["ACT", "SCENE", "DIRECTION", "All"].includes(r.player)
              // !r.player.includes("/")
              // !r.player.includes("(")
            )
              players.push(r.player);
          }
          setSceneCast(players);
        });
    };
    getSceneCast();
  }, [curPlay, curScene]);

  useEffect(() => {
    const getScenes = async () => {
      fetch(`data/${curPlay}/scenes.json`)
        .then((res) => res.json())
        .then((data) => {
          const scenelist = data.map((obj) => obj.scene);
          let arr = [[], [], [], [], [], []];
          for (let scene of scenelist) {
            arr[scene.split(".")[0]].push(scene);
          }
          setScenes(arr);
        });
    };
    const getFullCast = async () => {
      fetch(`data/${curPlay}/cast.json`)
        .then((res) => res.json())
        .then((data) => {
          let players = [];
          for (let r of data) {
            if (
              !["ACT", "SCENE", "DIRECTION", "All"].includes(r.player) &&
              !r.player.includes("/") &&
              !r.player.includes("(")
            )
              players.push(r.player);
          }
          setFullCast(players);
        });
    };
    getScenes();
    getFullCast();
  }, [curPlay]);

  const inScene = (shortName) => {
    for (let fullName of sceneCast) {
      if (fullName.includes(shortName)) return true;
    }
    return false;
  };

  return (
    <div>
      <button
        className={curScene === "_" ? "selected" : null}
        onClick={() => handleSceneChange("_")}
      >
        Full Play
      </button>
      <br />
      {scenes.map((act, i) => (
        <div key={i}>
          {act.map((scene, j) => (
            <button
              className={scene === curScene ? "selected" : null}
              onClick={() => handleSceneChange(scene)}
              key={j}
            >
              {scene}
            </button>
          ))}
        </div>
      ))}
      <br />
      {fullCast.map((character, i) => (
        <button
          className={curRole.includes(character) ? "selected" : null}
          onClick={() => handleRoleChange(character)}
          disabled={!inScene(character)}
          key={i}
        >
          {character}
        </button>
      ))}
    </div>
  );
};

export default Control;
