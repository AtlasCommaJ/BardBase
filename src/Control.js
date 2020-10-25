import React, {useState, useEffect} from 'react';

function Control(props) {
    const {curPlay, curScene, curRole, handleSceneChange, handleRoleChange} = props;

    const [scenes, setScenes] = useState([])
    const [fullCast, setFullCast] = useState([]);
    const [sceneCast, setSceneCast] = useState([]);


    useEffect(() => {
        const getSceneCast = async () => {
            fetch(`https://p9hv9v5blg.execute-api.us-east-2.amazonaws.com/Primary/${curPlay}/${curScene}`)
            .then(res => res.json())
            .then(res => {
                const data = JSON.parse(res);
                setSceneCast(data.map(obj => obj.player));
            })
        }
        getSceneCast()
    }, [curPlay, curScene])


    useEffect(() => {
        const getScenes = async () => {
            fetch(`https://p9hv9v5blg.execute-api.us-east-2.amazonaws.com/Primary/${curPlay}/scenes`)
            .then(res => res.json())
            .then(res => {
                const data = JSON.parse(res)
                const scenelist = data.map(obj => obj.scene);
                let arr = [[],[],[],[],[],[]];
                for (let scene of scenelist) {
                    arr[scene.split('.')[0]].push(scene)
                }
                setScenes(arr);
            })
        }
        const getFullCast = async () => {
            fetch(`https://p9hv9v5blg.execute-api.us-east-2.amazonaws.com/Primary/${curPlay}`)
            .then(res => res.json())
            .then(res => {
                const data = JSON.parse(res);
                let players = []
                for (let r of data) {
                    if (!['ACT','SCENE','DIRECTION','All'].includes(r.player) && !(r.player.includes('/')) && !(r.player.includes('(')))
                        players.push(r.player);
                }
                setFullCast(players);
            })
        }
        getScenes()
        getFullCast()
    }, [curPlay])


    const inScene = (shortName) => {
        for (let fullName of sceneCast) {
            if (fullName.includes(shortName))
                return true;
        }
        return false;
    }


    return (
        <div>
            <button className={curScene==="_" ? "selected" : null} onClick={() => handleSceneChange("_")}>Full Play</button> <br />
            {scenes.map((act) => <div> {act.map(scene => <button className={(scene === curScene) ? "selected" : null}
                                                                 onClick={() => handleSceneChange(scene)}>{scene}</button>)}</div>)}
            <br />
            {fullCast.map((character) => <button className={(curRole.includes(character)) ? "selected" : null} 
                                                 onClick={() => handleRoleChange(character)}
                                                 disabled={!inScene(character)}>{character}</button>
                                                 )}
        </div>
    )
}

export default Control;