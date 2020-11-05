import './App.css';
import { Route, Switch} from "react-router-dom";
import ConfluenceDash from './components/ConfluenceDash'
import { Component } from 'react';
import "firebase/firestore"
import firebase from 'firebase/app'
import history from './components/history'



class App extends Component {

  state= {
    confluenceId : ''
  }

  makeId = (length)=> {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
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
          confluenceId : confluenceId
        })
        history.push(`/confluence/${this.state.confluenceId}`)

      })
      .catch((error) => {
        console.log('error', error)
      })

  }

  render(){
    return (
      <Switch>
        <Route exact path='/'>
          <div className="App">
            <div>
            <div id="main-card">   
            <div id="main-title">
            <h1>confluence-io</h1>
               <button onClick={this.handleNewConfluence} class="form-item-button">create a new confluence</button>
            </div>
            </div>
            <div id="main-about">
              <h2>what am i?</h2>
              <p>words </p>
            </div>  
            </div>   
          </div>
        </Route>
  
        <Route path='/confluence'>
          <ConfluenceDash confluenceId={this.state.confluenceId}/>
        </Route>

      </Switch>
    );
  }
}

export default App;
