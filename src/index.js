import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import { store } from './stores/index'
import ReactGA from 'react-ga';


ReactGA.initialize(process.env.REACT_GA || "UA-137257046-2");

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider>
            <App />
        </MuiThemeProvider>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
