import React from 'react';
import AddAdminQuestionForm from './addAdminQuestionForm.jsx';
import BroadcastModal from './broadcastquestionmodal';
import StudentModal from './studentModal';
import ExpandedQuestionModal from "./expandedQuestionModal";
import socketIOClient from "socket.io-client";


export default class Video extends React.Component{
    constructor(props){
        super(props);
        this.state={
            view : '',
            selectedQuestion: '',
            displayQuestion: false,
            sentQuestion: '',
            //socket state values
            response: '',
            endpoint: '/'
        }

        this.handleQuestionSelect = this.handleQuestionSelect.bind(this);
        this.handleSendQuestion = this.handleSendQuestion.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.resetSelect = this.resetSelect.bind(this);
        this.handleQuestionToBroadcast = this.handleQuestionToBroadcast.bind(this);
    }

    resetSelect(){
      this.setState({ selectedQuestion: '' });

    }

    toggleModal(event){
        
        if (this.state.view === '' && event.target.id === 'addButton' || this.state.view === 'saved' && event.target.id === 'addButton'){
            this.setState({ view: 'add' });
        } else if (this.state.view === '' || this.state.view === 'add' && event.target.id === 'savedButton') {
                this.setState({ view: 'saved' })
        }else{
            this.setState({
                view: '',
                selectedQuestion: ''
            });
        }
    }  

    handleQuestionSelect(event) {
        this.setState({selectedQuestion: event});
    }

    handleSendQuestion() {
  
        this.socket.emit('broadcast', this.state.selectedQuestion); //or this.state.sentQuestion
        // this.handleQuestionToBroadcast();
    }

    handleQuestionToBroadcast(question){
        console.log('compare question:', question);
        console.log('compare this.state.selectedQuestion', this.state.selectedQuestion);
        this.setState({ displayQuestion: true, sentQuestion: question });

        setTimeout(() => { this.setState({ displayQuestion: false, sentQuestion: '' }) }, 7000);
    }

    componentDidMount(){
        // this.socket = socketIOClient('http://0.0.0.0:3001');
        this.socket = socketIOClient('/');
        this.socket.on('questionToBroadcast', question =>{
            console.log('socket on questionToBroadcast pinged correctly, question: ', question);
            this.handleQuestionToBroadcast(question);
        });
    }

    componentWillUnmount(){
        this.socket.off('questionToBroadcast');
    }

    renderModalSwitch(){
        if (this.state.view === 'add'){
            return(
                <div className="container">
                    <AddAdminQuestionForm
                        view={this.state.view}
                        toggle={this.toggleModal}
                        callback={this.props.passQuestionCallback}
                        adminData={this.props.adminData}
                        setStateCallback={this.toggleModal}
                    />
                </div>
                    
                  
            );
        }else if(this.state.view === 'saved'){
            return(
                <div className="container">
                    <BroadcastModal view={this.state.view}
                        handleSendQuestion={this.handleSendQuestion}
                        options={this.props.data}
                        toggle={this.toggleModal}
                        question={this.state.selectedQuestion}
                        handleSelect={this.handleQuestionSelect}
                        deleteAdminQuestion={this.props.deleteAdminQuestion}
                        resetSelect={this.resetSelect}
                        />
                </div>
            );
        }else{
            return(
                <React.Fragment/>
            );
        }
    }

    render(){

        if (this.props.userType === 'admin') {
            return (
                <div id="video" className="col-10 fullheight">
                    <iframe src={`https://player.twitch.tv/?channel=${this.props.adminData[1]}&muted=true`} height="100%" width="100%" frameBorder="0" scrolling="no" allowFullScreen={true}> </iframe>
                    <div className="front btn-group-vertical"
                        style={{ 'bottom': 70 + 'vh', "height": 150 + 'px' }}>
                        <button id="addButton" type="button" className="btn btn-primary" onClick={this.toggleModal}>
                            <i id="addButton" className="admin-button fa fa-plus-square-o"></i>
                        </button>
                        <button id="savedButton" type="button" className="btn btn-primary" onClick={this.toggleModal}>
                            <i id="savedButton" className="admin-button fa fa-list-ul"></i>
                        </button>
                    </div> 
                    {this.renderModalSwitch()}    
                    {/* <ExpandedQuestionModal/> */}
                </div>
            )
        } else {
            if (this.state.displayQuestion){
                return (
                    <div id="video" className="col-10 fullheight">
                        <iframe src={`https://player.twitch.tv/?channel=${this.props.adminData[1]}&muted=true`} height="100%" width="100%" frameBorder="0" scrolling="no" allowFullScreen={true}></iframe>
                        <StudentModal adminQuestion={this.state.sentQuestion} />
                    </div>
                )
            } else {
                return (
                    <div id="video" className="col-10 fullheight">
                        <iframe src={`https://player.twitch.tv/?channel=${this.props.adminData[1]}&muted=true`} height="100%" width="100%" frameBorder="0" scrolling="no" allowFullScreen={true}></iframe>
                    </div>
                )
            }
        }
    }
}