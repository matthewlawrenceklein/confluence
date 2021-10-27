import './App.css';
import ConfluenceDash from './components/ConfluenceDash'
import { Component } from 'react';
import "firebase/firestore"
import firebase from 'firebase/app'
import history from './components/history'



class App extends Component {

  state = {
    userInput : ''
  }

  makeId = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result
  }

  handleNewConfluence = () => {
    let confluenceId = this.makeId(10)
    let db = firebase.firestore()

    db.collection('confluence').doc(confluenceId).set({})
      .then(() => {
        this.setState({
          confluenceID: confluenceId
        })
        history.push(`/${this.state.confluenceID}`)

      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  handleLoadConfluence = () => {
    const db = firebase.firestore()
    db.collection('confluence').doc(this.state.userInput).get()
      .then((doc) => {
        if(doc.exists){
          this.setState({
            confluenceID : this.state.userInput
          })
        } else {
          alert('sorry, we were unable to find your confluence :/')
        }

      })
  }

  handleUserInput = (e) => {
    this.setState({
      userInput : e.target.value
    })
  }

  returnToHome = () => {
    this.setState({
      confluenceID : null
    })
  }

  render() {
    return (
      !this.state.confluenceID ?
          <div className="App">
            <div id='landing-master'>
              <div id="main-card">
                <div id="main-title">
                  <h1>ConfluenceIO</h1>
                  <div id='main-title-ui'>
                    <button onClick={this.handleNewConfluence} class="form-item-button">create a new confluence</button>
                    <div id='main-load-confluence'>
                      <input type='text' value={this.state.userInput} onChange={(e) => this.handleUserInput(e)} class='form-item-input' />
                      <button onClick={() => this.handleLoadConfluence()} class="form-item-button">join an existing confluence</button>
                    </div>
                  </div>
                </div>
              </div>
              <div id="main-about">
                <h2 className='about-title'>what</h2>
                <p>
                  ConfluenceIO invites users to share streaming platform subscriptions amongst friend-groups, eliminating
                  costly and redundant subscriptions while cultivating communal media consumption.
                </p>

                <h2 className='about-title'>why</h2>
                <p>
                  ConfluenceIO was made to address the issue of streaming platform proliferation
                  which has quickly become a "cable TV with extra steps" scenario. The rapid splintering of content
                  amongst the ever-increasing pool of subscription platforms has left the end-user responsible for purchasing
                  and managing more and more subscriptions, with an ever diminishing return in value.
                </p>
                <h2 className='about-title'>how</h2>
                <p>
                  Click above to create a new blank confluence dashboard. There you can add the platforms you subscribe to, as well
                  as the platforms you're interested in. Share your dashboard's url amongst friends, and ConfluenceIO will analyse
                  when reciprocol platform matches are detected. Share more, pay media conglomerates less.
                </p>
                <h2 className='about-title'>who</h2>
                <p>
                  ConfluenceIO was created by
                  <a href='http://matthewlawrencekle.in' target='_blank' rel='noreferrer'> matthew lawrence klein </a>
                  with help from
                  <a href='https://evereichmann.github.io/portfolio/' target='_blank' rel='noreferrer'> eve reichmann</a>
                  . looking to contribute? find the ConfluenceIO repo
                  <a href='https://github.com/matthewlawrenceklein/confluence' target='_blank' rel='noreferrer'> here </a>.
                </p>
              </div>
            </div>
          </div>
          :
          <ConfluenceDash confluenceID={this.state.confluenceID} returnToHome={this.returnToHome}/>
    );
  }
}

export default App;
