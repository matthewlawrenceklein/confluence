import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Router } from 'react-router-dom'
import firebase from 'firebase/app'
import history from './components/history'


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "confluence-io.firebaseapp.com",
  databaseURL: "https://confluence-io.firebaseio.com",
  projectId: "confluence-io",
  storageBucket: "confluence-io.appspot.com",
  messagingSenderId: "810410856810",
  appId: "1:810410856810:web:e4dd2daefa8bb596a01513",
  measurementId: "G-616PTGD5NP"
};

firebase.initializeApp(firebaseConfig);


ReactDOM.render(
  <Router history={history}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
