import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import QuotesLibrary from './quotes-library';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
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