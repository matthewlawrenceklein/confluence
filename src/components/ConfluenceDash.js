import React, { Component, Fragment } from 'react';
import ServiceCard from './ServiceCard'
import "firebase/firestore"
import firebase from 'firebase/app'
import { BitlyClient } from 'bitly-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import history from './history'

class ConfluenceDash extends Component {

    state = {
        services : ['Hulu', 'Netflix', 'HBO', 'Amazon', 'CBS All Access', 'CrunchyRoll', 
                    'VRV', 'Peacock', 'ESPN+', 'Disney+', 'YoutubeTV', 'fubo', 'tubi', ],
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

                // users is an array of users
                // each indice in the users array is a sub array
                    // index 0 of the sub array is the user name STRING
                    // index 1 of the sub array is an object, with keys for HAVES and WANTS

                // users[0][0]  => name
                // users[0][1].haves => haves
                // users[0][1].wants => wants

                if(users.length > 1){

                    for(let i = 0; i < users.length; i++){
                        for(let j = 1; j < users.length; j++){
                            let firstUserHaves = users[i][1].haves
                            let firstUserWants = users[i][1].wants

                            let matchedHaves = []
                            let matchedWants = []

                            let secondUserHaves = users[j][1].haves
                            let secondUserWants = users[j][1].wants

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
                                console.log(matchedHaves, matchedWants, users[i][0], users[j][0] )
                                let wanter = users[i][0]
                                let haver = users[j][0] 

                                let combinedStatement = `${wanter} and ${haver} have matches! they should talk to each other about ${matchedWants} and ${matchedHaves}`

                                this.setState({
                                    matchStatements : [...this.state.matchStatements, combinedStatement]
                                })
                                // matchedHaves.forEach(have => {
                                //     let statement = `${wanter} has ${have}`
                                //     this.setState({
                                //         matchStatements : [...this.state.matchStatements, statement]
                                //     })
                                // })
                                // matchedWants.forEach(want => {
                                //     let statement = `${haver} has ${want}`
                                //     this.setState({
                                //         matchStatements : [...this.state.matchStatements, statement]
                                //     })
                                // })
                            }
                        }
                    }
                } 

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
                console.log('well done')
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
        return this.state.matchStatements.map(statement => {
        return <p>{statement}</p>
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
                        <CopyToClipboard text={this.state.bitlyURL} onCopy={() => alert('nice')}>
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
                    {this.renderResults()}
                </div>

            </Fragment>
        );
    }
}

export default ConfluenceDash;
