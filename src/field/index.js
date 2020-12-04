const React = require('react');
const Tile = require('../tile');

const common = require('../common');

const store = require('../store');
const FIELD_SIZE = 600;
module.exports = Field;
require('./style.less');
function Field(props) {
    React.Component.call(this, props);
    this.props = props;
    this.state = {
    /*    points: props.points,
        tiled: props.tiled,
        teams: props.teams,*/
        selected: null
    }
    this.getTileColor = getTileColor.bind(this);
    function getTileColor(i, j) {
        if (this.props.tiled[i][j] === 0) return 0;
        if (this.props.tiled[i][j] === this.props.teams[0].teamID) return 1;
        return 2;
    }

    this.getAgent = getAgent.bind(this);
    function getAgent(i, j) {
        for (let agent of this.props.teams[0].agents) {
            if (agent.x - 1 === j && agent.y - 1 === i) return 1;
        }
        for (let agent of this.props.teams[1].agents) {
            if (agent.x - 1 === j && agent.y - 1 === i) return 2;
        }
        return 0;
    }

    this.selectAgent = selectAgent.bind(this);
    function selectAgent(i, j) {
        //this.setState({selected: {x:j, y: i}});
        store.dispatch({type: 'default', selected: {x:j, y:i}});
    }
    this.getTeam = getTeam.bind(this);
    function getTeam() {
        if (this.props.teamID === this.props.teams[0].teamID) return 1;
        if (this.props.teamID === this.props.teams[1].teamID) return 2;
        return 0;
    }
    this.registerAction = registerAction.bind(this);
    this.getMisc = (i, j) => {
        if (this.props.obstacles && this.props.obstacles.find(o => o.x - 1 === j && o.y - 1 === i)) return { obstacle: 1 };
        const treasure = this.props.treasure && this.props.treasure.find(t => t.x - 1 === j && t.y - 1 === i);
        if (treasure) return { ...treasure, treasure: 1 };
        return null;
    }
    function registerAction(e, selected) {
        e.stopPropagation();
        e.preventDefault();
        if ( selected.x === null||selected.x === undefined || selected.y === null || selected.y === undefined)
            return;
        let agentID, team, x, y, agent;
        if (this.props.teamID === this.props.teams[0].teamID) {
            team = this.props.teams[0];
        }
        else if (this.props.teamID === this.props.teams[1].teamID) {
            team = this.props.teams[1];
        }
        else return;

        agent = team.agents.find(a => (a.x === selected.x + 1 && a.y === selected.y + 1)) || {};
        agentID = agent.agentID;

        if (!agentID) return;
        let action = {type: 'REGISTER_ACTION'};
        let actionSpec;
        let tiled = this.props.tiled;
        let nextTile;
        switch(e.key) {
        case "ArrowRight":
        case "d":
        case "D":
            if (agent.x === this.props.points[0].length) return;
            actionSpec = {direction:'right'};
            nextTile = tiled[agent.y - 1][agent.x];
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            if (agent.x === 1) return;
            actionSpec = {direction:'left'};
            nextTile = tiled[agent.y - 1][agent.x - 2];
            break;
        case "ArrowUp":
        case "w":
        case "W":
            if (agent.y === 1) return;
            actionSpec = {direction:'up'};
            nextTile = tiled[agent.y - 2][agent.x - 1];
            break;
        case "ArrowDown":
        case "x":
        case "X":
            if (agent.y === this.props.points.length) return;
            actionSpec = {direction:'down'};
            nextTile = tiled[agent.y][agent.x - 1];
            break;
        case "q":
        case "Q":
            if (agent.y === 1 || agent.x === 1) return;
            actionSpec = {direction:'up-left'};
            nextTile = tiled[agent.y - 2][agent.x - 2];
            break;
        case "e":
        case "E":
            if (agent.y === 1 || agent.x === this.props.points[0].length) return;
            actionSpec = {direction:'up-right'};
            nextTile = tiled[agent.y - 2][agent.x];
            break;
        case "c":
        case "C":
            if (agent.y === this.props.points.length || agent.x === this.props.points[0].length) return;
            actionSpec = {direction:'down-right'};
            nextTile = tiled[agent.y][agent.x];
            break;
        case "z":
        case "Z":
            if (agent.y === this.props.points.length || agent.x === 1) return;
            actionSpec = {direction:'down-left'};
            nextTile = tiled[agent.y][agent.x - 2];
            break;
        default:
            return;
        }

        if ( nextTile === 0 || nextTile === this.props.teamID)
            actionSpec.action = "move";
        else
            actionSpec.action = "remove";
        action['' + agentID] = actionSpec;
        store.dispatch(action);

        let newState = store.getState();
        let actions = newState.actions;
        let agents = Object.keys(actions);
        console.log(agents.length);
        if (agents.length === this.props.teams[0].agents.length) {
            console.log("actions");
            common.sendActions(actions);
        }
    }
    this.render = function() {
        //let selected = this.state.selected||{};
        let selected = store.getState().selected;
        let size = FIELD_SIZE/this.props.points[0].length + 'px';
        return <div className="Field" tabIndex="0" onKeyDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
        }} onKeyPress={(e) => {
            e.stopPropagation();
            e.preventDefault();
        }} onKeyUp={e => this.registerAction(e, selected)}>
            {this.props.points.map((row, i) => (
                <div key={i} className="row">{row.map((point, j) => (
                    <Tile size={size} key={j} point={point}
                        misc={this.getMisc(i, j)}
                        tile={this.getTileColor(i, j)}
                        agent={this.getAgent(i, j)}
                        team={this.getTeam()}
                        selected={selected.x === j && selected.y === i}
                        onTileClick={() => this.selectAgent(i, j)} />
                ))}</div>
            ))}
        </div>
    }
}

Field.prototype = Object.create(React.Component.prototype);
