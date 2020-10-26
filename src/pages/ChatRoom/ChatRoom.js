import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ActionRouteNavigate } from "../../store/actions/action-route";
import {
    ActionGetChats, ActionSendMessage, ActionGetUserList,
    ActionCreateNewChat, ActionFileMessage, ActionCreateGroup,
    ActionGroupMessage, ActionGroupUpload, ActionAddUserToGroup,
    ActionRemoveUserFromGroup, ActionClearGruopChat, ActionClearIndividualChat
} from "../../store/actions/action-user";
import Header from "../../components/Header/header";


import "./ChatRoom.css";

class ChatRoom extends React.Component {

    constructor(props) {
        super(props);
        this.props.ActionGetUserList();
        this.props.ActionGetChats(this.props.email);
    }

    state = {
        chatIndex: 0,
        file: null,
        msg: "",
        groupName: "",
        groupDoc: ""
    };

    componentDidMount() {
        if (this.props.chat && this.state.chatIndex === 0 && this.props.chat[this.state.chatIndex] && this.props.chat[this.state.chatIndex]["groupName"]) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    groupDoc: this.props.chat[prevState.chatIndex]["groupName"],
                }
            });
        }
    }

    render() {
        var nonChatUserList = null;
        var groupUsers = null;
        var addGroupMember = null;
        var allUserList = null;

        if (this.props.userList && this.props.chat) {
            allUserList = Object.keys(this.props.userList).map(i => {
                return (this.props.userList[i].email);
            }) || null;
            const chatUsrList = Object.keys(this.props.chat).map(i => {
                return (this.props.chat[i].users.filter(e => e !== this.props.email)[0])
            });
            nonChatUserList = allUserList.filter(e => !chatUsrList.includes(e) && e !== this.props.email);

        }
        if (this.state.groupDoc && allUserList) {
            groupUsers = (this.props.chat.find(ch => ch.groupName === this.state.groupDoc))['users'] || [];
            addGroupMember = allUserList.filter(x => !groupUsers.includes(x));
        }
        return (
            <React.Fragment>
                <Header></Header>
                <div className="msg-container">
                    <div className="userMsg">
                        <ul>
                            <li id="myBtn" onClick={this.newChatHandler} className="newchat">New Chat</li>
                        </ul>
                        <ul>
                            <li id="addButton" onClick={this.createGropChatModalHandler} className="newchat">Create Group</li>
                        </ul>
                        {/*{this.state.groupDoc ? <ul><li id="groupAddButton" onClick={this.addUserModalHandler} className="newchat">Add User</li>
                        </ul> : ""}*/}
                        <div id="myModal" className="modal">
                            <div className="modal-content">
                                <span className="close">&times;</span>
                                <ul className="modal-list">
                                    {nonChatUserList && nonChatUserList.length > 0 ? nonChatUserList.map(e => <li onClick={() => this.createNewChatHandler(e)} className="modal-list-item" key={e}>{e}</li>) : <li className="modal-list-item">No User</li>}
                                </ul>
                            </div>
                        </div>
                        <div id="groupchatModal" className="modal">
                            <div className="modal-content">
                                <span className="close">&times;</span>
                                <ul className="modal-list">
                                    <li>
                                        <form>
                                            <input type="text" vlaue={this.state.groupName} onChange={(e) => this.onGropNameChange(e.target.value)} placeholder="Enter group name" ></input>
                                            <input type="submit" value="Create Group" onClick={this.createGropHandler}></input>
                                        </form>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id="addUserToGroup" className="modal">
                            <div className="modal-content">
                                <span className="close">&times;</span>
                                <ul className="modal-list">
                                    {addGroupMember && addGroupMember.length > 0 ? addGroupMember.map(u => <li onClick={() => this.addNewUserToGroupHandler(u)} className="modal-list-item" key={u}>{u}</li>) : <li className="modal-list-item">No User</li>}
                                </ul>
                            </div>
                        </div>
                        <div id="removeUserToGroup" className="modal">
                            <div className="modal-content">
                                <span className="close">&times;</span>
                                <ul className="modal-list">
                                    {groupUsers && groupUsers.length > 0 ? groupUsers.map(u => <li className="modal-list-item" key={u}>{u}<button onClick={() => this.removeUserFromGroup(u)}>Remove</button></li>) : <li className="modal-list-item">No User</li>}
                                </ul>
                            </div>
                        </div>



                        {this.props.chat ? this.props.chat.map((msg, index) => {
                            return (
                                <ul
                                    className="userMsg-List"
                                    style={{ backgroundColor: this.state.chatIndex === index ? "red" : null }}
                                    key={index}
                                    onClick={() => this.setState({ ...this.state, chatIndex: index, groupDoc: msg.groupName })}
                                >
                                    <li className="userMsg-listItemLogo">
                                        {msg.groupName === null || msg.groupName === undefined || msg.groupName === '' ?
                                            msg.users
                                                .filter((user) => user !== this.props.email)[0]
                                                .split("")[0]
                                            :
                                            msg.groupName
                                                .split("")[0]
                                        }
                                    </li>
                                    <li className="userMsg-listItem">
                                        {msg.groupName === null || msg.groupName === undefined || msg.groupName === '' ?
                                            msg.users.filter((user) => user !== this.props.email)[0] : msg.groupName.split("@")[0]
                                        }
                                    </li>
                                </ul>
                            );
                        }) : null}
                    </div>
                    <div className="user-details">
                        {this.state.groupDoc ? <div><button id="groupAddButton" onClick={this.addUserModalHandler} className="">Add User</button></div> : ""}
                        {this.state.groupDoc ? <div><button id="userRemoveButton" onClick={this.removeUserFromGroupModalHandler} className="">Group Detail</button></div> : ""}
                        <div><button onClick={this.clearAllChat}>Clear Chat</button></div>
                    </div>
                    <div id="messageId" className="usermessage">
                        <ul className="usermessage-list">
                            {this.props.chat !== null && this.props.chat !== undefined && this.props.chat.length > 0 && this.props.chat[this.state.chatIndex].messages ?
                                Object.keys(this.props.chat[this.state.chatIndex].messages).map((mg, index) => {
                                    var msg = this.props.chat[this.state.chatIndex].messages[mg];
                                    if (msg.sender === this.props.email) {
                                        if (msg.img === undefined || msg.img === null || msg.img === "") {
                                            return (<li className="sentMsg" key={index}>{msg.message}</li>);
                                        } else {
                                            return (
                                                <li key={index} className="sentMsg img"> <img alt="msg" className="imgMsg" src={msg.img}></img></li>)
                                        }
                                    }
                                    else {
                                        if (msg.img === undefined || msg.img === null || msg.img === "") {
                                            return (
                                                <React.Fragment key={index}>
                                                    <li className="rcvdMsg " key={index}>{msg.message}</li>
                                                    {this.state.groupDoc ? <li>{msg.sender}</li> : ""}
                                                </React.Fragment>
                                            );
                                        } else {
                                            return (
                                                <React.Fragment key={index}>
                                                    <li key={index} className="rcvdMsg img"> <img alt="msg" className="imgMsg" src={msg.img}></img></li>
                                                    {this.state.groupDoc ? <li>{msg.sender}</li> : ""}
                                                </React.Fragment>
                                            )
                                        }
                                    }
                                }) : null
                            }
                        </ul>
                    </div>
                    <div className="userInput">
                        <form className="input-form">
                            <input style={{ width: "100%" }} value={this.state.msg} onChange={(e) => this.msgChangeHandler(e.target.value)} placeholder="Send message....." id="userInputMsg" type="text" ></input>
                            <input className="file-input" onChange={e => this.fileChangeHandler(e.target.files)} type="file"  ></input>
                            <input type="submit" value="send" onClick={this.sendMessageHandler} />
                        </form>
                    </div>
                </div>
            </React.Fragment >
        );
    }

    msgChangeHandler = (msg) => {
        this.setState({ ...this.state, msg: msg })
    }
    fileChangeHandler = (file) => {
        this.setState({ ...this.state, file: file })
    }
    sendMessageHandler = (e) => {
        e.preventDefault();
        if (this.state.groupDoc === "" || this.state.groupDoc === undefined || this.state.groupDoc === null) {
            if (this.state.msg !== "") {
                const to = this.props.chat[this.state.chatIndex].users.filter((user) => user !== this.props.email)[0];
                this.props.ActionSendMessage(this.state.msg, to, this.props.email);

                this.setState({ ...this.state, msg: '' })
            }
            else if (this.state.file !== null) {
                const to = this.props.chat[this.state.chatIndex].users.filter((user) => user !== this.props.email)[0];
                this.props.ActionFileMessage(this.state.file[0], to, this.props.email, this.props.uid);
                this.setState({ ...this.state, file: null });
            }
        } else {
            if (this.state.msg !== "") {
                this.props.ActionGroupMessage(this.state.msg, this.state.groupDoc, this.props.email);
                this.setState({ ...this.state, msg: '' })
            }
            else if (this.state.file != null) {
                this.props.ActionGroupUpload(this.state.file[0], this.props.email, this.state.groupDoc, this.props.uid);
                this.setState({ ...this.state, msg: '' })
            }
        }
    }

    onGropNameChange = (name) => {
        this.setState({ ...this.state, groupName: name });
    }

    createGropChatModalHandler = () => {
        var modal = document.getElementById("groupchatModal");
        var btn = document.getElementById("addButton");
        var span = document.getElementsByClassName("close")[1];
        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }
    createGropHandler = (e) => {
        e.preventDefault();
        if (this.state.groupName !== null && this.state.groupName !== undefined && this.state.groupName !== '') {

            document.getElementById("groupchatModal").style.display = "none";
            this.props.ActionCreateGroup(this.state.groupName, this.props.email, this.props.uid);
            this.setState({ ...this.state, groupName: "" });
        }
    }

    newChatHandler = () => {
        var modal = document.getElementById("myModal");
        var btn = document.getElementById("myBtn");
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }

    createNewChatHandler = (email) => {
        this.props.ActionCreateNewChat(email, this.props.email);
        document.getElementById("myModal").style.display = "none";
    }

    addUserModalHandler = (e) => {
        e.preventDefault();
        var modal = document.getElementById("addUserToGroup");
        var btn = document.getElementById("groupAddButton");
        var span = document.getElementsByClassName("close")[2];
        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }
    addNewUserToGroupHandler = (user) => {
        this.props.ActionAddUserToGroup(this.state.groupDoc, user);
    }
    removeUserFromGroupModalHandler = (e) => {
        e.preventDefault();
        var modal = document.getElementById("removeUserToGroup");
        var btn = document.getElementById("userRemoveButton");
        var span = document.getElementsByClassName("close")[3];
        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }
    }
    removeUserFromGroup = (name) => {
        this.props.ActionRemoveUserFromGroup(this.state.groupDoc, name);
    }
    clearAllChat = () => {
        if (this.state.groupDoc) {
            this.props.ActionClearGruopChat(this.state.groupDoc);
        }
        else {
            var user1 = this.props.email;
            var user2 = this.props.chat[this.state.chatIndex].users.filter(u => u !== user1)[0];
            this.props.ActionClearIndividualChat(user1, user2);

        }
    }
}



function mapStateToProps({ rLoading, rUser, rSession }) {
    return {
        email: rSession.user.uid,
        userList: rUser.userList,
        loading: rLoading.chatRoom,
        chatWith: rUser.chatWith,
        chat: rUser.messages || null,
        uid: rSession.user.uid,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            ActionRouteNavigate, ActionGetChats,
            ActionSendMessage, ActionGetUserList,
            ActionCreateNewChat, ActionFileMessage,
            ActionCreateGroup, ActionGroupMessage,
            ActionGroupUpload, ActionAddUserToGroup,
            ActionRemoveUserFromGroup, ActionClearGruopChat,
            ActionClearIndividualChat
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);
