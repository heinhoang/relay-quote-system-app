import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { AppContainer } from 'react-hot-loader';

import QuotesLibrary from './quotes-library';

// define the entry points into the Relay application
class AppRoute extends Relay.Route {
    static routeName = 'App';
}

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Relay.RootContainer 
        Component={Component} 
        route={new AppRoute}
      />
    </AppContainer>,
    document.getElementById('react')
  );
};
render(QuotesLibrary);

if (module.hot) {
    module.hot.accept('./quotes-library', () => {
        render(QuotesLibrary);
    });
}