import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import ContextProvider from './contextProvider';
import registerServiceWorker from './registerServiceWorker';

const app = (
    <ContextProvider>
        <App />
    </ContextProvider>
);

ReactDOM.render(app, document.querySelector('#root'));

registerServiceWorker();
