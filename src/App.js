import './App.css';
import { Link, Route, Switch } from "react-router-dom";
import ConfluenceDash from './components/ConfluenceDash'




function App() {
  return (
    <Switch>
      <Route exact path='/'>
        <div className="App">
          <h2>confluence.</h2>

          <Link to='/confluence'>
            <button>create a new confluence</button>
          </Link>
        </div>
      </Route>

      <Route path='/confluence'>
        <ConfluenceDash/>
      </Route>
    </Switch>
  );
}

export default App;
