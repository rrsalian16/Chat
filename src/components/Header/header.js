import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { ActionRouteNavigate } from '../../store/actions/action-route';
import { ActionLogout } from '../../store/actions/action-user';

import './header.css';

class Header extends Component {

    logOutHandler = () => {
        this.props.ActionLogout();
    }

    render() {
        return (
            <div className="header-container">
                <div className="header-logo ">
                    <h3 className="circle">Chat</h3>
                </div>
                <div className="user">
                    {/*<h4>{this.props.email}</h4>*/}
                    <button onClick={this.logOutHandler}>LogOut</button>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ rLoading, rSession }) {
    return {
        email: rSession.user.uid || null,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ActionRouteNavigate,
        ActionLogout
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);