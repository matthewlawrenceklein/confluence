import React, { Component } from 'react';
import ServiceCard from './ServiceCard'
import "firebase/firestore"
import firebase from 'firebase/app'
import { BitlyClient } from 'bitly-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import history from './history'

class ConfluenceDash extends Component {

    state = {
        services : ['Hulu', 'Netflix', 'HBO', 'Amazon', 'CBS All Access', 'CrunchyRoll', 
                    'VRV', 'Peacock', 'ESPN+', 'Disney+', 'YoutubeTV', 'fubo', 'tubi', 
                    'Apple TV', 'Spuul',
                    ],
        haves : [],
        wants : [],
        userName : '',
        bitlyURL : '',
        matchStatements : []
    }

    componentDidMount(){
        this.renderHaves()
        this.renderWants()
        this.generateBitly()
        this.renderMatches()
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

    renderMatches = () => {
        const db = firebase.firestore()
        const location = history.location.pathname.slice(-10)
        let users = []

        db.collection('confluence').doc(location).get()
            .then(doc => {
                users = Object.entries(doc.data())
                let checkedPairs = {}

                this.setState({matchStatements : []})

                if(users.length > 1){

                    for(let i = 0; i < users.length; i++){
                        for(let j = 1; j < users.length; j++){
                            let firstUserHaves = users[i][1].haves
                            let firstUserWants = users[i][1].wants

                            let matchedHaves = []
                            let matchedWants = []

                            let secondUserHaves = users[j][1].haves
                            let secondUserWants = users[j][1].wants

                            let wanter = users[i][0]
                            let haver = users[j][0] 

                            if(!checkedPairs[haver]){ // check to see if user at j index has been matched already as user at i index

                                firstUserWants.forEach(want => {
                                    if(secondUserHaves.includes(want)){
                                        matchedWants.push(want)
                                    }
                                })
    
                                firstUserHaves.forEach(have => {
                                    if(secondUserWants.includes(have)){
                                        matchedHaves.push(have)
                                    }
                                })
    
                                if(matchedHaves.length > 0 && matchedWants.length > 0){
                                    let combinedStatement = `${wanter} and ${haver} have matches! they should talk to each other about ${matchedWants} and ${matchedHaves}`
                                    this.setState({
                                        matchStatements : [...this.state.matchStatements, combinedStatement]
                                    })
                                }

                                checkedPairs[wanter] = true  // add user at i index to checkedObj to avoid redundant prints 
                            }

                        }
                    }
                } 

            })
    }

    addToList = (provider, type) => {        
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
    }

    handleNameChange = (e) => {
        this.setState({
            userName : e.target.value
        })   
    }

    handleSubmit = (e) => {
        e.preventDefault()
        let db = firebase.firestore()

        if(this.state.userName === ''){
            alert('hey, you need to input your name')
        }
        if(this.state.haves.length === 0 || this.state.wants.length === 0){
            alert('hey, you need haves AND wants!')
        } else {
            let location = history.location.pathname.slice(-10)
            let confluenceRef = db.collection('confluence').doc(location)
            confluenceRef.update({
                [this.state.userName] : {
                    haves : this.state.haves, 
                    wants : this.state.wants 
                }
            })
            .then(() => {
                this.setState({userName : ''})
                alert("you've been added! any matches will show up below")
                this.renderMatches()
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    generateBitly(){
        let location = history.location.pathname.slice(-10)
        const db = firebase.firestore()
        let bitlyKey = ''
        let uri = `https://confluence-io.app/confluence/${location}`

        db.collection('keys').doc('bitly').get()
        .then((doc) => {
            bitlyKey = doc.data().key
            const bitly = new BitlyClient(bitlyKey, {});

            const sendIt = async () => {
                let result;
                try {
                    result = await bitly.shorten(uri);
                } catch (e) {
                    throw e;
                }
                this.setState({
                    bitlyURL : result.url 
                })
            }
            sendIt()
        })
    }

    renderResults = () => {
        return this.state.matchStatements.map((statement, idx) => {
        return <p id='render-results' key={idx}>{statement}</p>
        })
    }

    render() {
        return (
            <div className='App'>
                <div id='top'>
                    <h2 id='dash-title' onClick={() => history.push('/')}>ConfluenceIO</h2>
                    <div>
                        <br/>
                        <h3 id='owned'>owned</h3>
                        <h3 id='wanted'>wanted</h3>
                        <br/>
                    </div>
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
                        <input id='form-input' type='text' placeholder='your name' value={this.state.userName} className='form-item' onChange={this.handleNameChange}/>
                        <button type='submit' className='form-item-button'>add yourself!</button>
                    </form>
                    { this.state.bitlyURL ? 
                        <CopyToClipboard text={this.state.bitlyURL} onCopy={() => alert('link has been copied')}>
                            <button className='form-item-button'>
                                copy confluence link to clipboard
                            </button>
                        </CopyToClipboard>
                    :
                    null 
                    }
                </div>
                <div id='bottom'>
                    <h2>matches</h2>
                    {this.renderResults()}
                </div>

            </div>
        );
    }
}

export default ConfluenceDash;
