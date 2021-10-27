import './App.css';
import { Route, Switch } from "react-router-dom";
import ConfluenceDash from './components/ConfluenceDash'
import { Component } from 'react';
import "firebase/firestore"
import firebase from 'firebase/app'
import history from './components/history'



class App extends Component {

  state = {
    confluenceId: ''
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
          confluenceId: confluenceId
        })
        history.push(`/${this.state.confluenceId}`)

      })
      .catch((error) => {
        console.log('error', error)
      })

  }

  render() {
    return (
      <Switch>
        <Route exact path='/'>
          <div className="App">
            <div id='landing-master'>
              <div id="main-card">
                <div id="main-title">
                  <h1>ConfluenceIO</h1>
                  <button onClick={this.handleNewConfluence} class="form-item-button">create a new confluence</button>
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
        </Route>

        <Route path="/:id" render={(props) => <ConfluenceDash {...props} />} />

      </Switch>
    );
  }
}

export default App;
