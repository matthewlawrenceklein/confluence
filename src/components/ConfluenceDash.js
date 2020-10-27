import React, { Component, Fragment } from 'react';
import ServiceCard from './ServiceCard'

class ConfluenceDash extends Component {

    state = {
        services : ['Hulu', 'Netflix', 'HBO', 'Amazon', 'CBS All Access', 'CrunchyRoll', 
                    'VRV', 'Peacock', 'ESPN+', 'Disney+', 'YoutubeTV', 'fubo', 'tubi', ],
        haves : [],
        wants : []
    }

    componentDidMount(){
        this.renderHaves()
        this.renderWants()
    }

    renderHaves = () => {
        return this.state.services.map((service, idx) => {
            return <ServiceCard title={service} key={idx} type='have' handleCardSelect={ this.handleCardSelect } addToList={ this.addToList }/>
        })
    }

    renderWants = () => {
        return this.state.services.map((service, idx) => {
            return <ServiceCard title={service} key={idx} type='want' handleCardSelect={ this.handleCardSelect } addToList={ this.addToList }/>
        })
    }

    addToList = (provider, type) => {
        console.log(provider, type)
        
        if(type === 'have'){
            this.state.haves.includes(provider) ? 
                this.setState({
                    haves : this.state.haves.filter(i => i !== provider )
                })
            :
                this.setState({
                    haves : [...this.state.haves, provider]
                })
        }
        else if(type === 'want'){
            this.state.wants.includes(provider) ? 
                this.setState({
                    wants : this.state.wants.filter(i => i !== provider )
                })
            :
                this.setState({
                    wants : [...this.state.wants, provider]
                })
        }

        console.log(this.state.haves)
        console.log(this.state.wants)

    }

    render() {
        return (
            <Fragment>
                <div id='top'>
                    <h3>your new confluence</h3>
                    <div id='master-container'>
                        <div className='sub-container'>
                            { this.renderHaves() }
                        </div>

                        <div className='sub-container'>
                            { this.renderWants() }    
                        </div>    
                    </div>
                </div>
                <div id='bottom'>
                    <h2> ho</h2>
                </div>

            </Fragment>
        );
    }
}

export default ConfluenceDash;
