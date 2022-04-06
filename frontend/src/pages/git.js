import React from 'react';
import $ from 'jquery';
import GitCommit from '../components/git_commit.js';
import GitHistory from '../components/git_history.js';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {BASE_URL_SERVER} from '../App.js';

$(document).ready(function() {
    $(".btn").click(function() {
        console.log("button clicked");
        console.log("actionbutton clicked");
        $(":button").each(function(){
            $(this).removeClass("btn-success");
            $(this).addClass("btn-primary");
        });
        $(this).removeClass("btn-primary");
        $(this).addClass("btn-success");
    });
});

export default class GitPage extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        message: "commit",
        Loading: false,
        SpaceId: ""
      }
      this.updateMessage = this.updateMessage.bind(this);
      this.setLoading    = this.setLoading.bind(this);
      this.setSpaceId    = this.setSpaceId.bind(this);
    }

    componentDidMount() {
      const SpaceId = window.location.href.split("/spaces/")[1].split("/git")[0];
      this.setSpaceId(SpaceId);
    }

    setSpaceId(id) {
      this.setState({
        SpaceId: id
      })
    }

    updateMessage(message) {
      this.setState({
        message: message
      });
    }

    setLoading(load) {
      this.setState({
        Loading: load
      });
    }

    sendPush(){
      console.log('pushing to git repo');
      console.log(this.state.SpaceId);
      //axios request 
      this.setLoading(true);
        axios.post(BASE_URL_SERVER+`apiv1/spaces/${this.state.SpaceId}/git/push`)
        .then(response => {this.setLoading(false);})
        .catch(error => {
        this.setLoading(false);
        alert(error);
      });
    }

    getPull(){
      console.log('pulling from git repo');
      this.setLoading(true);
        axios.post(BASE_URL_SERVER+`apiv1/spaces/${this.state.SpaceId}/git/pull`)
        .then(response => {this.setLoading(false);window.location.href = `/spaces/${this.state.SpaceId}/all_files`;})
        .catch(error => {
        this.setLoading(false);
        console.log(error);
        alert(error);
      });
    }

    render() {

      const message = this.state.message;
			let todisplay;
      if(message == "commit"){
				todisplay = <GitCommit />;
				console.log(todisplay);
			}
			if(message == "history"){
				todisplay = <GitHistory />;
				console.log(todisplay);
			}

      if(this.state.Loading){
        return(
        <div class="busy">
            <p>View differences: 
            <ReactLoading type='bars' color='#666' height={'20vw'} width={'20vw'} />
            </p>
        </div>
        )
      }
      
      if(this.state.Loading == false){
        return (
            <div>
                <div>
                  <hr />
                  <button onClick={() => this.updateMessage("commit")} id="commit_btn" type="button" style={{width:"23%",margin:"10px"}} class="btn btn-success" >Commit</button>
                  <button onClick={() => this.sendPush()} id="push_btn" type="button" style={{width:"23%",margin:"10px"}} class="btn btn-primary">Push</button>
                  <button onClick={() => this.getPull()} id="pull_btn" type="button" style={{width:"23%",margin:"10px"}} class="btn btn-primary">Pull</button>
                  <button onClick={() => this.updateMessage("history")} id="history_btn" type="button" style={{width:"23%",margin:"10px"}} class="btn btn-primary">History</button>
                  <hr />
                  {todisplay}
              </div>
            </div>
        );
      }
    }
  }
