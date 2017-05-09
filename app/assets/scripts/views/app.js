'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import c from 'classnames';
import ReactTooltip from 'react-tooltip';
import { StickyContainer } from 'react-sticky';
import { t } from '../utils/i18n';

import Header from '../components/header';
import Footer from '../components/footer';
import GlobalLoading from '../components/global-loading';
import ConfirmationPrompt from '../components/confirmation-prompt';

import SysAlerts from '../components/system-alerts';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    routes: T.array,
    location: T.object,
    children: T.object
  },

  render: function () {
    const pageClass = _.get(_.last(this.props.routes), 'pageClass', '');

    return (
      <div className={c('page', pageClass)}>
        <GlobalLoading />
        <Header pathname={this.props.location.pathname} />
        <main className='page__body' role='main'>
          <StickyContainer>
          {this.props.children}
          </StickyContainer>
        </main>
        <Footer />
        <ConfirmationPrompt />

        <SysAlerts/>

        <ReactTooltip id='tip-no-delete' effect='solid'>
          {t('The project\'s master scenario can\'t be deleted')}
        </ReactTooltip>
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(App);
