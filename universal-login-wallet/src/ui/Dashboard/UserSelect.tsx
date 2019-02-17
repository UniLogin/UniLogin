import React, {Component} from 'react';

type UserSelectProps = {
  name: any;
};

type UserSelectState = {

};

class UserSelect extends Component<UserSelectProps, UserSelectState> {

  componentDidMount() {
  }

  render() {
    return(
      <div className="user-select">
        <p className="user-select-name">{this.props.name}</p>
      </div>
    )
  }
}

export default UserSelect;
