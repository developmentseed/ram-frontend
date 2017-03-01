'use strict';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Redirect, hashHistory, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';
import { syncHistoryWithStore } from 'react-router-redux';

import config from './config';
import store from './utils/store';
import { isValidLanguage, setLanguage } from './utils/i18n';

// Views.
import App from './views/app';
import Home from './views/home';
import UhOh from './views/uhoh';
import ProjectPage from './views/project-page';

const history = syncHistoryWithStore(hashHistory, store);

const scrollerMiddleware = useScroll((prevRouterProps, currRouterProps) => {
  return prevRouterProps &&
    decodeURIComponent(currRouterProps.location.pathname) !== decodeURIComponent(prevRouterProps.location.pathname);
});

function validateLanguage (nextState, replace) {
  if (isValidLanguage(nextState.params.lang)) {
    setLanguage(nextState.params.lang);
  } else {
    replace('/en/404');
  }
}

render((
  <Provider store={store}>
    <Router history={history} render={applyRouterMiddleware(scrollerMiddleware)}>
      <Route path='/:lang' component={App} onEnter={validateLanguage}>
        <Route path="404" component={UhOh}/>
        <Route path="projects/:projectId" component={ProjectPage}/>
        <IndexRoute component={Home} pageClass='page--homepage' />
        <Route path="*" component={UhOh}/>
      </Route>
      <Redirect from='/' to='/en' />
    </Router>
  </Provider>
), document.querySelector('#app-container'));