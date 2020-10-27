import React, { Component } from 'react';

class ServiceCard extends Component {

    state = {
        selected : true,
        className : 'card' 
    }

    setCardClass = () => {
        if(this.state.selected && this.props.type === 'have'){
            this.setState({className : 'card-have-selected'})        
        } else if(this.state.selected && this.props.type === 'want'){
            this.setState({className : 'card-want-selected'})
        } else {
            this.setState({className : 'card'})
        }
    }

    handleCardSelect = () => {
        this.setState({ selected : !this.state.selected })
        this.setCardClass()
        console.log(this.state.selected)
    }


    render() {
        return (
            <div className={ this.state.className } onClick={ this.handleCardSelect }>
                <p>{ this.props.title }</p>
            </div>

        );
    }
}

export default ServiceCard;
