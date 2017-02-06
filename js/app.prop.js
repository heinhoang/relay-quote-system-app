import React from 'react'; 
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
// import { AppContainer } from 'react-hot-loader';

import QuotesLibrary from './quotes-library';

// define the entry points into the Relay application
class AppRoute extends Relay.Route {
    static routeName = 'App';
    // this function to trigger GraphQl query 
    static queries = {
        library: (Component) => Relay.QL `
            query QuotesLibrary {
                quotesLibrary {
                    ${Component.getFragment('library')}
                }
            }
        `
    }
}

const render = (Component) => {
  ReactDOM.render(
      <Relay.RootContainer 
        Component={Component} 
        route={new AppRoute()}
      />,
    document.getElementById('react')
  );
};
render(QuotesLibrary);

// if (module.hot) {
//     module.hot.accept('./quotes-library', () => {
//         render(QuotesLibrary);
//     });
// }