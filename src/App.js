import './App.css';
import { Route, Switch, Redirect, Link } from "react-router-dom";
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
    
    db.collection('confluence').doc(confluenceId).set({users : []})
      .then(() => {
        console.log('success')
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
            <h2>confluence.</h2>
  
            
               <button onClick={this.handleNewConfluence}>create a new confluence</button>

          </div>
        </Route>
  
        <Route path='/confluence'>
          <ConfluenceDash/>
        </Route>

      </Switch>
    );
  }
}

export default App;
