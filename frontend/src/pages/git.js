import React from 'react';
import $ from 'jquery';
import GitCommit from '../components/git_commit.js';
import GitHistory from '../components/git_history.js';

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
        message: "commit"
      }
      this.updateMessage = this.updateMessage.bind(this);
    }
  
    updateMessage(message) {
      console.log()
      this.setState({
        message: message
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
      return (
          <div>
              <div>
                <hr />
                <button onClick={() => this.updateMessage("commit")} id="commit_btn" type="button" style={{width:"23%",margin:"10px"}} class="btn btn-success" >Commit</button>
                <button  id="push_btn" type="button" style={{width:"23%",margin:"10px"}} class="btn btn-primary">Push</button>
                <button  id="pull_btn" type="button" style={{width:"23%",margin:"10px"}} class="btn btn-primary">Pull</button>
                <button onClick={() => this.updateMessage("history")} id="history_btn" type="button" style={{width:"23%",margin:"10px"}} class="btn btn-primary">History</button>
								<hr />
								{todisplay}
            </div>
          </div>
        
      );
    }
  }
