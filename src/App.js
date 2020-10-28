import './App.css';
import { Link, Route, Switch, Redirect } from "react-router-dom";
import ConfluenceDash from './components/ConfluenceDash'
import { Component } from 'react';

class App extends Component {

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

    
    
  }



  render(){
    return (
      <Switch>
        <Route exact path='/'>
          <div className="App">
            <h2>confluence.</h2>
  
            {/* <Link to='/confluence'>
              <button>create a new confluence</button>
            </Link> */}
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
