import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

function BackupCode(props) {
  return (
    <div>
      <div className="row align-items-center">
        <Blockies
          seed={props.identity.address.toLowerCase()}
          size={8}
          scale={6}
        />
        <p className="backup-code">
          {props.identity.name} <br />
          <strong>{props.code}</strong>
        </p>
      </div>
      <hr className="separator-s" />
    </div>
  );
}


BackupCode.propTypes = {
  identity: PropTypes.object,
  code: PropTypes.string
};


class BackupView extends Component {
  render() {
    return (
      <div className="subview">
        <div className="container">
          <h1 className="main-title">BACKUP CODES</h1>
          <p className="backup-text">
            Print these, cut them apart and keep them safe locations apart from
            each other. Keep them away from computers until you want to use
            them.
          </p>
          <hr className="separator-s" />
          {this.props.backupCodes.map((code) =>
            <BackupCode key={code} code={code} identity={this.props.identity}/>
          )}
          <div className="row">
            <div className="row align-items-center">
              {this.props.isLoading ? (
                <div className="row align-items-center">
                  <div className="circle-loader" />
                  <p className="backup-code">
                    {this.props.identity.name} <br />
                    <em>generating...</em>
                  </p>
                  <br />
                </div>
              ) : (
                <div className="row">
                  {this.props.backupCodes.length < 5 ? (
                    <div>
                      <button
                        className="generate-code-btn secondary-btn"
                        onClick={this.props.onGenerateClick.bind(this)}
                      >
                        Create more codes
                      </button>
                      <button
                        className="print-btn secondary-btn"
                        onClick={this.props.onPrintClick.bind(this)}
                      >
                        Print codes
                      </button>
                      <button
                        className={
                          this.props.isSetting
                            ? 'btn fullwidth disabled'
                            : 'btn fullwidth'
                        }
                        onClick={this.props.onSetBackupClick.bind(this)}
                      >
                        Set As Backup Codes
                      </button>
                      <p className="click-cost">
                        <i>Costs 2 kliks</i>
                      </p>
                    </div>
                  ) : (
                    <div className="row">
                      <button
                        className={
                          this.props.isSetting
                            ? 'btn fullwidth disabled'
                            : 'btn fullwidth'
                        }
                        onClick={this.props.onSetBackupClick.bind(this)}
                      >
                        Set As Backup Codes
                      </button>
                      <p className="click-cost">
                        <i>Costs 2 kliks</i>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={this.props.onCancelClick.bind(this)}
              className="secondary-btn"
            >
              Cancel backup code
            </button>
          </div>
        </div>
      </div>
    );
  }
}

BackupView.propTypes = {
  isLoading: PropTypes.bool,
  isSetting: PropTypes.bool,
  onSetBackupClick: PropTypes.func,
  onCancelClick: PropTypes.func,
  onGenerateClick: PropTypes.func,
  onPrintClick: PropTypes.func,
  backupCodes: PropTypes.array,
  identity: PropTypes.object
};

export default BackupView;
