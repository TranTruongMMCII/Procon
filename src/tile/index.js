const React = require('react');
module.exports = Tile;
require('./style.less');
function Tile(props) {
    React.Component.call(this, props);
    //this.props = props;
    this.render = function() {
        return (<div className={this.getTileClass()} onClick={(e) => {
            console.log("clicked");
            if (this.props.agent && this.props.team === this.props.agent)
                this.props.onTileClick();
        }} style={{
            width: this.props.size,
            height: this.props.size,
            lineHeight: this.props.size
        }}>
            {this.props.point}
            <span className="treasure-point">{this.getTreasurePoint()}</span>
        </div>);
    }
    function getTileClass() {
        const classes = ["Tile"];
        const misc = this.props.misc;
        if (misc) {
            if (misc.obstacle) classes.push("wall");
            else if (misc.treasure) {
                classes.push("treasure");
                if (misc.status) classes.push('claimed');
            }
        }
        if (this.props.agent === 1) classes.push("agent");
        else if (this.props.agent === 2) classes.push("agent");
        if (this.props.selected) classes.push("selected");

        if (this.props.tile === 1) classes.push("blue");
        else if (this.props.tile === 2) classes.push("red");

        return classes.join(' ');
    }
    this.getTileClass = getTileClass.bind(this);
    this.getTreasurePoint = () => {
        const misc = this.props.misc;
        if (!misc || !misc.treasure) return null;
        return misc.point;
    }
}

Tile.prototype = Object.create(React.Component.prototype);
