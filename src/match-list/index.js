const React = require('react');
const store = require('../store');

const common = require('../common.js');
module.exports = MatchList;
require('./style.less');
function MatchList(props) {
    React.Component.call(this,props);
    this.state = {
        matches: [],
        show: true
    }
    this.getMatches = function(reduxState) {
        let baseUrl = reduxState.baseUrl;
        store.dispatch({
            type: "ERROR",
            error: ""
        });
        fetch(baseUrl + '/matches', {
            method: 'GET',
            headers: {
                'Authorization': reduxState.token
            }
        }).then(response => {
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(jsonResponse => {
            if (Array.isArray(jsonResponse))
                this.setState({
                    matches: jsonResponse
                });
            if (jsonResponse.success === false) {
                store.dispatch({
                    type: "ERROR",
                    error: `${jsonResponse.message.name}-${jsonResponse.message.message}`
                });
            }
        }).catch(e => {
            console.error(e);
            store.dispatch({
                type: "ERROR",
                error: e.message
            });
        });
    }
    this.updateField = () => {
        common.updateField();
    }

    this.render = function() {
        let reduxState = store.getState();
        let token = reduxState.token;
        return (<div className="MatchList">
            <div>
                <button onClick={e => this.getMatches(reduxState)}>Get Matches</button>
                <button onClick={(e) => this.updateField()}>Update</button>
                <button onClick={e => this.setState(state => ({show:!state.show}))}>Show-Hide</button>
            </div>
            {this.state.show?
            (<div style={{display:'table'}}>
                <div style={{display:'table-row'}}>
                    <div className="cell header">ID</div>
                    <div className="cell header">team</div>
                    <div className="cell header">Room</div>
                    <div className="cell header">turns</div>
                    <div className="cell header">turn sec</div>
                    <div className="cell header">interval sec</div>
                    <div className="cell header"></div>
                </div>
                {(this.state.matches||[]).map((m,idx) => (
                    <div key={idx} style={{display:'table-row'}}>
                        <div className="cell">{m.id}</div>
                        <div className="cell">{reduxState.teamName} ({m.teamID})</div>
                        <div className="cell">{m.matchTo}</div>
                        <div className="cell">{m.turns}</div>
                        <div className="cell">{m.turnMillis/1000}</div>
                        <div className="cell">{m.intervalMillis/1000}</div>
                        <div className="cell"><button onClick={e => {
                            store.dispatch({type:"JOIN_MATCH", ...m});
                            this.updateField();
                        }}>Join</button></div>
                    </div>
                ))}
            </div>):(<div />)}
        </div>)
    }
}

MatchList.prototype = Object.create(React.Component.prototype);
