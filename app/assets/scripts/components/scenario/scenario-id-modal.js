'use strict';
import React, { PropTypes as T } from 'react';
import ReactTooltip from 'react-tooltip';
import c from 'classnames';

import { t } from '../../utils/i18n';
import { boundsToMapLocation } from '../../utils/geo';
import config from '../../config';
import { showGlobalLoading, hideGlobalLoading } from '../global-loading';

import { Modal, ModalHeader, ModalBody, ModalFooter } from '../modal';

const ScenarioIDModal = React.createClass({

  propTypes: {
    revealed: T.bool,
    onCloseClick: T.func,

    scenarioData: T.object,
    projectBbox: T.array
  },

  notifier: null,

  setupNotifier: function () {
    this.notifier = notifier('rra-frontend', this.refs.editor.contentWindow);

    this.notifier.on('loaded', () => {
      this.notifier.send('settings', {
        projectId: this.props.scenarioData.project_id,
        scenarioId: this.props.scenarioData.id
      });
    });

    this.notifier.on('ready', (data) => {
      hideGlobalLoading();
      this.setState({
        editorLoaded: true,
        editorWidth: data.mapWidth,
        editorHeight: data.mapHeight
      });
    });

    this.notifier.on('save:status', data => {
      this.setState({saveEnabled: data.enabled});
    });
  },

  getInitialState: function () {
    return {
      editorLoaded: false,
      saveEnabled: false,
      editorWidth: 0,
      editorHeight: 0
    };
  },

  componentDidUpdate: function (prevProps) {
    if (!prevProps.revealed && this.props.revealed) {
      showGlobalLoading();
      this.setupNotifier();
    }
  },

  componentWillReceiveProps: function (nextProps) {
    // When the modal gets closed set the editor and not loaded.
    if (this.props.revealed && !nextProps.revealed) {
      this.setState({editorLoaded: false});
    }
  },

  componentWillUnmount: function () {
  },

  onClose: function () {
    this.props.onCloseClick();
  },

  onSaveClick: function () {
    this.notifier.send('save:click');
  },

  render: function () {
    const mapLocation = boundsToMapLocation(this.props.projectBbox, this.state.editorWidth, this.state.editorHeight);

    return (
      <Modal
        id='modal-scenario-metadata'
        className='modal--large'
        onCloseClick={this.onClose}
        revealed={this.props.revealed} >

        <ModalHeader>
          <div className='modal__headline'>
            <h1 className='modal__title'>{t('Edit road network')}</h1>
            <div className='modal__description'>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>

        <section className='ideditor-wrapper'>
          <h1 className='visually-hidden'>iD editor</h1>
          <iframe src={`${config.iDEditor}/#map=${mapLocation.zoom}/${mapLocation.center.lat}/${mapLocation.center.lng}`} className={c({'visually-hidden': !this.state.editorLoaded})} frameBorder='0' ref='editor'></iframe>
        </section>

        </ModalBody>
        <ModalFooter>
          <button className='mfa-xmark' type='button' onClick={this.onClose}><span>{t('Cancel')}</span></button>
          <button data-tip data-for='tip-no-save' className={c('mfa-tick', {'visually-disabled': !this.state.saveEnabled})} type='submit' onClick={this.onSaveClick}><span>{t('Save')}</span></button>

        <ReactTooltip id='tip-no-save' effect='solid' disable={this.state.saveEnabled}>
          {t('Nothing to save')}
        </ReactTooltip>

        </ModalFooter>
      </Modal>
    );
  }
});

export default ScenarioIDModal;

/**
 * Communication between iframes
 * @param  {String} id      Id to use for the communication
 * @param  {window} element Window object. (for the iframe is accessible
 *                          through iframe.contentWindow)
 * @return {notifier}       Notifier object.
 */
function notifier (id, element) {
  let events = {};

  let _notifier = {
    on: (type, cb) => {
      if (!events[type]) events[type] = [];
      events[type].push(cb);
      return _notifier;
    },
    send: (type, data = {}) => {
      let msg = Object.assign({}, { id: id, type: type }, data);
      element.postMessage(msg, '*');
      return _notifier;
    }
  };

  window.addEventListener('message', e => {
    if (!e.data.type) return;
    let cbs = events[e.data.type] || [];
    cbs.forEach(cb => cb(e.data));
  });

  return _notifier;
}