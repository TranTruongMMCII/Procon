const ReactDOM = require('react-dom');
const React = require('react');
const Fragment = React.Fragment;
const Tile = require('./tile');
const Field = require('./field');
const ControlForm = require('./control-form');
const MatchList = require('./match-list');
const InfoPanel = require('./info-panel');
let store = require('./store');
//store.dispatch({type:"default",token:"abc"});
//store.dispatch({type:"default",teamID: "2"});

/*const map = { "turn": 2, "teams": [ { "agents": [ { "x": 10, "y": 1, "agentID": 2 }, { "x": 1, "y": 10, "agent ID": 3 } ], "teamID": 12, "areaPoint": 0, "tilePoint": 2 }, { "agents": [ { "x": 1, "y": 1, "agentID": 5 }, { "x": 9, "y": 9, "agentID": 7 } ], "areaPoint": 0, "tilePoint": 1, "teamID": 16 }], "tiled": [ [ 16, 0, 0, 0, 0, 0, 0, 0, 0, 12 ], [ 0, 16, 0, 0, 0, 0, 0, 0, 12, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 12, 0, 0, 0, 0, 0, 0, 16, 0 ], [ 12, 0, 0, 0, 0, 0, 0, 0, 0, 16 ] ], "width": 10, "height": 10, "points": [ [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ] ], "actions": [ { "dx": 1, "dy": -1, "turn": 1, "type": "move", "apply": 1, "agentID": 2 }, { "dx": -1, "dy": 1, "turn": 1, "type": "move", "apply": 1, "agentID": 3 }, { "dx": -1, "dy": -1, "turn": 1, "type": "move", "apply": 1, "agentID": 5 }, { "dx": 0, "dy": 0, "turn": 1, "type": " stay", "apply": 1, "agentID": 7 } ], "startedAtUnixTime": 1561800000 }*/
const reactElem = document.querySelector('#reactApp');

const jwtDecode = require('jwt-decode');
function doRender() {
    let state = store.getState();
    let teamID = state.teamID;
    let map = state.map;
    ReactDOM.render((<Fragment>
        <MatchList />
        <ControlForm teamID={teamID} teams={map.teams}
            width={map.points.length} height={map.points[0].length}
            actions={state.actions} />
        <Field points={map.points} tiled={map.tiled} teams={map.teams} teamID={teamID} treasure={map.treasure} obstacles={map.obstacles} />
        <InfoPanel />
    </Fragment>), reactElem);
}

store.subscribe(doRender);
doRender();
