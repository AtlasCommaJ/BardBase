import React, {useState, useEffect} from 'react';

function Cast(props) {
    const [cast, setCast] = useState([]);
    useEffect(() => {
        getSceneCast();
    }, []);

    function getSceneCast() {
        fetch('http://localhost:3001/hamlet/Ii')
            .then(response => {
                return response.text();
            })
            .then(data => {
                setCast(JSON.parse(data))
            });
    }
    return (
        <div>
            {cast.map((character) => <button onClick={() => props.updateRole(character.player.toUpperCase())}>{character.player}</button> )}
            <button onClick={() => props.updateRole("")}>Clear</button>
        </div>
    );
}

export default Cast;