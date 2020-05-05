import React, { Component } from 'react';

class Player extends Component {
    state = {  }

    componentDidMount() {
        console.log(this.props.match.params.id)
    }
    
    render() { 
        return (  <div><h2>hello world from player</h2></div>)
    }
}
 
export default Player;