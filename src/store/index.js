const Redux = require('redux');
const jwtDecode = require('jwt-decode');
function mapReducer(state, action) {
    console.log('mapReducer', state, action)
    switch(action.type) {
    case "REGISTER_ACTION":
        state.actions = state.actions || {};
        let {type, ...act} = action;
        Object.assign(state.actions, act);
        break;
    case "SELECT_AGENT":
        state.selected.x = action.x;
        state.selected.y = action.y;
        break;
    case "JOIN_MATCH":
        state.teamID = action.teamID;
        state.turns = action.turns;
        state.turnMillis = action.turnMillis;
        state.intervalMillis = action.intervalMillis;
        state.room = action.matchTo;
        state.matchID = action.id;
        state.actions = {};
        state.selected = {};
        break;
    case "UPDATE_MAP":
        state.map = action.map;
        state.remainingSec = action.remainingSec;
        if (action.reset) {
            state.actions = {};
            state.selected = {};
            state.sendState = "pending";
        }
        break;
    case "SEND_STATE":
        state.sendState = action.sendState;
        break;
    case "ERROR":
        state.error = action.error;
        break;
    default:
        if (action.token && action.token.length) {
            state.token = action.token;
            try {
                let decoded = jwtDecode(state.token);
                state.teamName = decoded.data;
            }
            catch(e) {}
        }
        let teamID = parseInt(action.teamID);
        if (!isNaN(teamID)) {
            state.teamID = teamID;
        }
        if (action.actions) {
            state.actions = action.actions;
        }
        if (action.selected) {
            state.selected = action.selected;
        }
    }
    return Object.assign({},state);
}

const store = Redux.createStore(mapReducer, {
    type:"default",
    baseUrl: 'http://112.137.129.202:8888',
    token:"", teamID:0,
    actions: {},
    selected: {},
    map: {
        "turn": 2,
        "teams": [ {
            "agents": [ {
                "x": 10,
                "y": 1,
                "agentID": 2
            },
            {
              "x": 1,
              "y": 10,
              "agentID": 3
            } ],
            "teamID": 12,
            "areaPoint": 0,
            "tilePoint": 2
        },
        {
          "agents": [
            {
              "x": 1,
              "y": 1,
              "agentID": 5
            },
            {
              "x": 9,
              "y": 9,
              "agentID": 7
            }
          ],
          "areaPoint": 0,
          "tilePoint": 1,
          "teamID": 16
        }],
        "tiled": [
          [ 16, 0, 0, 0, 0, 0, 0, 0, 0, 12 ],
          [ 0, 16, 0, 0, 0, 0, 0, 0, 12, 0 ],
          [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
          [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
          [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
          [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
          [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
          [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
          [ 0, 12, 0, 0, 0, 0, 0, 0, 16, 0 ],
          [ 12, 0, 0, 0, 0, 0, 0, 0, 0, 16 ]
        ],
        "width": 10,
        "height": 10,
        "points": [
          [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
          [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
          [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
          [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
          [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
          [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
          [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
          [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
          [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
          [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ]
        ],
        "actions": [
          {
            "dx": 1,
            "dy": -1,
            "turn": 1,
            "type": "move",
            "apply": 1,
            "agentID": 2
          },
          {
            "dx": -1,
            "dy": 1,
            "turn": 1,
            "type": "move",
            "apply": 1,
            "agentID": 3
          },
          {
            "dx": -1,
            "dy": -1,
            "turn": 1,
            "type": "move",
            "apply": 1,
            "agentID": 5
          },
          {
            "dx": 0,
            "dy": 0,
            "turn": 1,
            "type": " stay",
            "apply": 1,
            "agentID": 7
          }
        ],
        "startedAtUnixTime": 1561800000
    }
});
module.exports = store;

