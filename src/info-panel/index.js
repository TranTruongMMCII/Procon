const React = require('react');
const store = require('../store');
require('./style.less');
module.exports = InfoPanel;
function InfoPanel(props) {
    React.Component.call(this, props);
    this.render = function() {
        let reduxState = store.getState();
        let teams = (reduxState.map || {}).teams;
        let turn = (reduxState.map||{}).turn;
        /*
        let turnMillis = reduxState.turnMillis;
        let fullTurnMillis = reduxState.turnMillis + reduxState.intervalMillis;
        let turns = reduxState.turns;
        let startTime = (reduxState.map || {}).startedAtUnixTime;
        let now = Date.now();
        let remainingMillis = Math.max(turnMillis - ((now - startTime) % fullTurnMillis), 0);
        */
        return (<div className="InfoPanel">
            {teams.map((t,idx) => (<div key={idx} className="team">
                <div>{t.teamID === reduxState.teamID?reduxState.teamName:t.teamID}</div>
                <div>{t.tilePoint}</div>
                <div>{t.areaPoint}</div>
                <div>{t.tilePoint + t.areaPoint}</div>
            </div>))}
            <p />
            <div className="turn">{turn}/{reduxState.turns||'NA'}</div>
            <div className="time">{Math.round(reduxState.remainingSec) || 0}</div>
        </div>);
    }
}
InfoPanel.prototype = Object.create(React.Component.prototype);
