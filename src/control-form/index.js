const React = require('react');
const store = require('../store');

const _ = require('lodash');

module.exports = ControlForm;

require('./style.less');
function ControlForm(props) {
    React.Component.call(this, props);
    console.log(this.props);
    let reduxStore = store.getState();
    this.state = {
        baseUrl: reduxStore.baseUrl,
        token: reduxStore.token
    }
    this.updateStore = _.debounce(updateStore.bind(this), 100);
    function updateStore(attr, value) {
        store.dispatch({
            type: 'default',
            [attr]: value,
            actions: []
        });
    }

    function getTeam() {
        return this.props.teams.find(team => this.props.teamID === team.teamID) || {agents:[]};
    }
    this.getTeam = getTeam.bind(this);

    function formInputChanged(attr, evt) {
        console.log("Form input change", attr, evt);
        this.setState({
            [attr]: evt.currentTarget.value
        });
        this.updateStore(attr, evt.currentTarget.value);
    }
    this.formInputChanged = formInputChanged.bind(this);

    function getAgentClassName(agent) {
        let selected = store.getState().selected;
        let classStr = "";
        if (agent.x - 1 === (selected||{}).x && agent.y - 1 === (selected||{}).y)
            classStr += " selected";
        if (this.props.actions["" + agent.agentID])
            classStr += " done";
        return classStr;
    }
    this.getAgentClassName = getAgentClassName.bind(this);

    function selectAgent(x, y) {
        store.dispatch({type: "SELECT_AGENT", x, y});
        document.querySelector(".Field").focus();
    }
    this.selectAgent = selectAgent.bind(this);

    this.render = function() {
        let fields = Object.keys(this.state);
        let reduxState = store.getState();
        console.log(fields);
        console.log(reduxState);
        return (<div className="ControlForm">
            <div className="config-pane">
                {fields.map((attr,idx) => (<div key={idx}>
                    <div className="form-label">{attr}</div>
                    <div className="form-input">
                        <input type='text'
                            value={this.state[attr]}
                            onChange={(e) => this.formInputChanged(attr, e)} />
                    </div>
                </div>))}
                <div className="error-message">{reduxState.error}</div>
            </div>
            <div className="action-pane">
                <div className="action-queue">
                    {this.getTeam().agents.map((agent, idx) => (
                        <div key={idx} className={this.getAgentClassName(agent)}
                            onClick={e => selectAgent(agent.x - 1, agent.y - 1)}>
                            <div className="tr">{agent.agentID}</div>
                            <div className="tr">{agent.x}-{agent.y}</div>
                            <div className="tr">
                                {(this.props.actions["" + agent.agentID] || {}).action || 'NA'}
                            </div>
                            <div className="tr">{(this.props.actions["" + agent.agentID] || {}).direction || 'NA'}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>)
    }
}
ControlForm.prototype = Object.create(React.Component.prototype);
