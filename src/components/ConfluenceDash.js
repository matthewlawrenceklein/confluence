import React, { Component, Fragment } from 'react';
import ServiceCard from './ServiceCard'
import "firebase/firestore"
import firebase from 'firebase/app'
import { BitlyClient } from 'bitly-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class ConfluenceDash extends Component {

    state = {
        services : ['Hulu', 'Netflix', 'HBO', 'Amazon', 'CBS All Access', 'CrunchyRoll', 
                    'VRV', 'Peacock', 'ESPN+', 'Disney+', 'YoutubeTV', 'fubo', 'tubi', ],
        haves : [],
        wants : [],
        userName : '',
        bitlyURL : ''
    }

    componentDidMount(){
        this.renderHaves()
        this.renderWants()
        this.generateBitly()
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

    handleNameChange = (e) => {
        this.setState({
            userName : e.target.value
        })   
        console.log(this.state.userName)
    }

    handleSubmit = (e) => {
        e.preventDefault()
        let db = firebase.firestore()
        let batch = db.batch()

        if(this.state.userName === ''){
            alert('hey, you need to input your name')
        }
        if(this.state.haves.length === 0 || this.state.wants.length === 0){
            alert('hey, you need haves AND wants!')
        } else {

            let confluenceRef = db.collection('confluence').doc(this.props.confluenceId)
            batch.set(confluenceRef, {[this.state.userName] : {
                haves : this.state.haves, 
                wants : this.state.wants 
            }})
            batch.commit().then(() => {
                console.log('great job')
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    async generateBitly(){
        const bitly = new BitlyClient('78fe3e713482b9ce269520fd40f97d057b093a8f', {});
        let result;

        let uri = `https://confluence-io.app/confluence/${this.props.confluenceId}`
        try {
        result = await bitly.shorten(uri);
        } catch(e) {
        throw e;
        }
        this.setState({
            bitlyURL : result
        })

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

                <div id='middle'>
                    <form onSubmit={this.handleSubmit}>
                        <input type='text' placeholder='your name' value={this.state.userName} className='form-item' onChange={this.handleNameChange}/>
                        <button type='submit' className='form-item'>add yourself!</button>
                    </form>
                    { this.state.bitlyURL ? 
                        <CopyToClipboard text={this.state.bitlyURL.url}>
                            <button className='form-item'>
                                copy confluence link to clipboard
                            </button>
                        </CopyToClipboard>
                    :
                    null 
                    }
                </div>
                <div id='bottom'>
                    <h2> ho</h2>
                </div>

            </Fragment>
        );
    }
}

export default ConfluenceDash;
