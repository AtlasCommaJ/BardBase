import React from 'react';

function Cast(props) {
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
        getFullCast()
    }, [curPlay])
}