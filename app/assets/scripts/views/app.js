'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import c from 'classnames';
import ReactTooltip from 'react-tooltip';
import { StickyContainer } from 'react-sticky';

import config from '../config';
import { t } from '../utils/i18n';

import Header from '../components/header';
import Footer from '../components/footer';
import GlobalLoading from '../components/global-loading';
import ConfirmationPrompt from '../components/confirmation-prompt';
import NotLoggedError from '../components/not-logged-error';
import SysAlerts from '../components/system-alerts';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    routes: T.array,
    location: T.object,
    children: T.object,
    isAuthenticated: T.bool
  },

  goToAnchor: function (hash) {
    if (!hash) return;
    let el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView();
    }
  },

  componentDidMount: function () {
    this.goToAnchor(this.props.location.hash);
  },

  componentDidUpdate: function (prevProps) {
    if (this.props.location.hash && prevProps.location.hash !== this.props.location.hash) {
      this.goToAnchor(this.props.location.hash);
    }
  },

  render: function () {
    let showAuth = false;
    if (config.auth && config.auth.clientID) {
      showAuth = true;
    }

    const pageClass = _.get(_.last(this.props.routes), 'pageClass', '');

    return (
      <div className={c('page', pageClass)}>
        <GlobalLoading />
        <Header pathname={this.props.location.pathname} showAuth={showAuth} isAuthenticated={this.props.isAuthenticated}/>
        <main className='page__body' role='main'>
          <StickyContainer>
          {showAuth && !this.props.isAuthenticated ? <NotLoggedError /> : this.props.children}
          </StickyContainer>
        </main>
        <Footer />
        <ConfirmationPrompt />

        <SysAlerts/>

        <ReactTooltip id='tip-no-delete' effect='solid'>
          {t('The project\'s primary scenario can\'t be deleted')}
        </ReactTooltip>
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(App);
