'use strict';
import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
import c from 'classnames';

import { fileTypesMatrix } from '../../utils/constants';
import { t, getLanguage } from '../../utils/i18n';
import config from '../../config';

import ModalPoi from './source-modals/modal-poi';
import ModalProfile from './source-modals/modal-profile';
import ModalAdminBounds from './source-modals/modal-admin-bounds';
import ModalRoadNetwork from './source-modals/modal-road-network';
import ModalOrigins from './source-modals/modal-origins';

class PorjectSourceData extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  openModal () {
    this.setState({modalOpen: true});
  }

  onTitleClick (e) {
    if (this.props.editable) {
      e.preventDefault();
      return this.openModal();
    }
  }

  closeModal (needRefresh) {
    this.setState({modalOpen: false});
    if (needRefresh) {
      this.props.refreshData();
    }
  }

  renderModal () {
    if (!this.props.editable) {
      return null;
    }

    var TheModal = null;
    switch (this.props.type) {
      case 'profile':
        TheModal = ModalProfile;
        break;
      case 'admin-bounds':
        TheModal = ModalAdminBounds;
        break;
      case 'origins':
        TheModal = ModalOrigins;
        break;
      case 'road-network':
        TheModal = ModalRoadNetwork;
        break;
      case 'poi':
        TheModal = ModalPoi;
        break;
    }

    return TheModal ? (<TheModal
      onCloseClick={this.closeModal.bind(this)}
      revealed={this.state.modalOpen}
      type={this.props.type}
      sourceData={this.props.sourceData}
      projectId={this.props.projectId}
      scenarioId={this.props.scenarioId}
      _showAlert={this.props._showAlert}
    />) : null;
  }

  renderSourceInfo () {
    if (this.props.sourceData.type === 'osm') {
      return <p className='card__subtitle'>{t('OSM source data')}</p>;
    }

    if (this.props.sourceData.type === 'default') {
      return <p className='card__subtitle'>{t('Default settings')}</p>;
    }

    if (!this.props.sourceData.files.length) {
      return <p className='card__subtitle'>{t('No source files')}</p>;
    }

    return <p className='card__subtitle'>{t('{count} source files', {count: this.props.sourceData.files.length})}</p>;
  }

  render () {
    let { display, description, helpPath } = fileTypesMatrix[this.props.type];

    let downloadLink;
    switch (this.props.type) {
      case 'profile':
      case 'admin-bounds':
      case 'origins':
        downloadLink = `${config.api}/projects/${this.props.projectId}/source-data?download=true&type=${this.props.type}`;
        break;
      case 'poi':
      case 'road-network':
        downloadLink = `${config.api}/projects/${this.props.projectId}/scenarios/${this.props.scenarioId}/source-data?download=true&type=${this.props.type}`;
        break;
    }

    return (
      <section className={c(`card psb psb--${this.props.type}`, {'psb--complete': this.props.complete})}>
        <div className='card__contents'>
          <header className='card__header'>
            <div className='card__headline'>
              <a title={t('Edit detail')} className='link-wrapper' href={downloadLink} onClick={this.onTitleClick.bind(this)}>
                <h1 className='card__title'>{display}</h1>
              </a>
              {this.renderSourceInfo()}
            </div>
            <div className='card__actions actions'>
              <ul className='actions__menu'>
                <li>
                  <Link className='actions__menu-item ca-question' title={t('Learn more')} target='_blank' to={`/${getLanguage()}${helpPath}`}>
                    <span>{t('What is this?')}</span>
                  </Link>
                </li>
              </ul>
              <ul className='actions__menu'>
                <li>
                  <a className={c('actions__menu-item ca-download', {disabled: this.props.sourceData.files.length === 0})} title={t('Export raw data')} href={downloadLink}>
                    <span>{t('Download')}</span>
                  </a>
                </li>
                {this.props.editable ? (
                  <li>
                    <button className='actions__menu-item ca-pencil' type='button' title={t('Modify details')} onClick={this.openModal.bind(this)}>
                      <span>{t('Edit')}</span>
                    </button>
                  </li>
                ) : null}
              </ul>
            </div>
          </header>
          <div className='card__body'>
            <div className='card__summary'>
              <p>{description}</p>
            </div>
          </div>
        </div>

        {this.renderModal()}
      </section>
    );
  }
}

PorjectSourceData.defaultProps = {
  editable: true
};

PorjectSourceData.propTypes = {
  editable: T.bool,
  type: T.string,
  complete: T.bool,
  sourceData: T.object,
  projectId: T.number,
  scenarioId: T.number,
  _showAlert: T.func,
  refreshData: T.func
};

export default PorjectSourceData;
