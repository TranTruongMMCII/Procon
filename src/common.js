const store = require('./store');

module.exports = {
    sendActions, updateField, scheduleUpdate
}

function prepareActionsPayload(actions, turn) {
    let payload = [];
    for (let agentID in actions) {
        let agentMove = {agentID: parseInt(agentID), turn:turn, type: actions[agentID].action};
        switch(actions[agentID].direction) {
            case "down": 
                agentMove.dx = 0;
                agentMove.dy = 1;
                break;
            case "up":
                agentMove.dx = 0;
                agentMove.dy = -1;
                break;
            case "left":
                agentMove.dx = -1;
                agentMove.dy = 0;
                break;
            case "right":
                agentMove.dx = 1;
                agentMove.dy = 0;
                break;
            case "down-right":
                agentMove.dx = 1;
                agentMove.dy = 1;
                break;
            case "down-left":
                agentMove.dx = -1;
                agentMove.dy = 1;
                break;
            case "up-right":
                agentMove.dx = 1;
                agentMove.dy = -1;
                break;
            case "up-left":
                agentMove.dx = -1;
                agentMove.dy = -1;
                break;
        }
        payload.push(agentMove);
    }
    return {actions:payload};
}

function sendActions(actions) {
    let reduxState = store.getState();
    if (reduxState.sendState === 'sent') return;
    let payload = prepareActionsPayload(actions, reduxState.map.turn);
    if (!payload.actions.length) return;
    fetch(`${reduxState.baseUrl}/matches/${reduxState.matchID}/action`, {
        method: 'POST',
        headers: {
            Authorization: reduxState.token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(response => {
        if (response.status !== 200) throw new Error(response.statusText);
        return response.json();
    }).then(jsonResponse => {
        if (jsonResponse.success === false) {
            throw new Error(`${jsonResponse.message.name}-${jsonResponse.message.message}`);
        }
        store.dispatch({
            type: "SEND_STATE",
            sendState: "sent"
        });
    }).catch(e => store.dispatch({
        type: "ERROR",
        error: e.message
    }));
}
function calculateRemainingTime(map, reduxState) {
    let turnMillis = reduxState.turnMillis;
    let fullTurnMillis = reduxState.turnMillis + reduxState.intervalMillis;
    let turns = map.turns;
    let startTime = map.startedAtUnixTime;
    let now = Date.now();
    return Math.max(turnMillis - ((now - startTime) % fullTurnMillis), 0)/1000;
}
function updateField() {
    console.log('updateField');
    let reduxState = store.getState();
    let reset = false;
    fetch(reduxState.baseUrl + '/matches/' + reduxState.matchID, {
        method: "GET",
        headers: {
            Authorization: reduxState.token
        }
    }).then(response => response.json()).then(jsonResponse => {
        if (jsonResponse.success === false) {
            console.log(jsonResponse.message);
        }
        else {
            let remainingSec = calculateRemainingTime(jsonResponse, reduxState);
            if (remainingSec > reduxState.remainingSec) {
                //sendActions(reduxState.actions);
                reset = true;
            }
            store.dispatch({
                type: "UPDATE_MAP", 
                map:jsonResponse, 
                remainingSec: remainingSec,
                reset: reset
            });
        }
    }).catch(e => {
        console.error(e);
    }).finally(() => {
        if (reset) scheduleUpdate(100);
        else scheduleUpdate(2000);
    });
}

let timerObj = null;
function scheduleUpdate(delay = 2000) {
    console.log("sechuleUpdate");
    if (timerObj) {
        clearTimeout(timerObj);
        timerObj = null;
    }
    let reduxState = store.getState();
/*
    let turnMillis = reduxState.turnMillis;
    let intervalMillis = reduxState.intervalMillis;
    let fullTurnMillis = turnMillis + intervalMillis;

    let startTime = reduxState.map.startedAtUnixTime;
    let turn = reduxState.map.turns;

    let now = Date.now();
    let remainingMillis = fullTurnMillis - ((now - startTime) % fullTurnMillis) + 100;
*/
    timerObj = setTimeout(() => {updateField();timerObj = null;}, delay);
}
