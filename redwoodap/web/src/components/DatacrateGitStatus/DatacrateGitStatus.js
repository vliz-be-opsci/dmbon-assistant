import {Modal} from "react-bootstrap";
import { getGitStatus } from "src/utils/AxiosRequestsHandlers";
import { useState, useEffect } from "react";
import AxiosError from "../AxiosError/AxiosError";
import LoadingBlock from "../LoadingBlock/LoadingBlock";
import {BsCloudDownload, BsCloudUpload} from 'react-icons/bs';
import {FiGitCommit} from 'react-icons/fi';
import {AiOutlineCheck} from 'react-icons/ai';
import { postGitCommand } from "src/utils/AxiosRequestsHandlers";
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline'
import './DatacrateGitStatus.css';

const DatacrateGitStatus = (datacrate_uuid) => {

  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading git status...');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [git_status_timeline, setGitStatusTimeline] = useState({});
  const [ShowModalCommit, setShowModalCommit] = useState(false);
  const [CommitMessage, setCommitMessage] = useState('');
  const [CommitDescription, setCommitDescription] = useState('');

  useEffect(() => {
    getGitStatus(datacrate_uuid)
      .then(res => {
        console.log(res.data)
        setGitStatusTimeline(gitStatusToTimeline(res.data));
        setLoading(false);
      }
      )
      .catch(err => {
        console.log(err);
        setErrorMessage(err.response);
        setLoading(false);
        setError(true);
      }
      )
  }, [])

  const handleCommit = () => {
    const payload = {"message": [CommitMessage, CommitDescription].join("\n")};
    setLoadingMessage('Committing changes...');
    setLoading(true);
    postGitCommand(datacrate_uuid, "commit", payload)
      .then(response => {
        setShowModalCommit(false);
        getGitStatus(datacrate_uuid)
            .then(res => {
              console.log(res.data)
              setGitStatusTimeline(gitStatusToTimeline(res.data));
              setLoading(false);
            }
            )
            .catch(err => {
              console.log(err);
              setErrorMessage(err.response);
              setLoading(false);
              setError(true);
            }
            )
      }
      ).catch(error => {
        console.log(error);
      }
      );
  }

  const handleClickActionButton = (action) => {
    console.log(action);
    //if action == 'pull' then change text in button to 'Pulling...'
    if (action == 'pull') {
      setLoadingMessage('Pulling changes...');
      setLoading(true);
      postGitCommand(datacrate_uuid,"pull",{"message": "summary_message"})
        .then(response => {
          setLoadingMessage('Loading git status...');
          getGitStatus(datacrate_uuid)
            .then(res => {
              console.log(res.data)
              setGitStatusTimeline(gitStatusToTimeline(res.data));
              setLoading(false);
            }
            )
            .catch(err => {
              console.log(err);
              setErrorMessage(err.response);
              setLoading(false);
              setError(true);
            }
            )
        }).catch(error => {
          console.log(error);
        });
    }
    if (action == 'push') {
      setLoadingMessage('Pushing changes...');
      setLoading(true);
      postGitCommand(datacrate_uuid,"push",{"message": "summary_message"})
        .then(response => {
          setLoadingMessage('Loading git status...');
          getGitStatus(datacrate_uuid)
            .then(res => {
              console.log(res.data)
              setGitStatusTimeline(gitStatusToTimeline(res.data));
              setLoading(false);
            }
            )
            .catch(err => {
              console.log(err);
              setErrorMessage(err.response);
              setLoading(false);
              setError(true);
            }
            )
        }).catch(error => {
          console.log(error);
        });
    }
  }

  //function that will interpret the git status and return dict for making the timeline
  const gitStatusToTimeline = (git_status) => {
    let git_status_timeline_ = {}
    //check if git_status.behind > 0
    if (git_status.behind > 0) {
      //pull request
      git_status_timeline_.pull_request = {
        'title': 'Pull Request',
        'color': '#87a2c7',
        'subtitle': git_status.behind+' commits behind',
        'action': {
          'label': 'Pull Changes',
          'onClick': () => {handleClickActionButton('pull')}
        }
      }
      git_status_timeline_.commit = {}
      git_status_timeline_.push_request = {}
      git_status_timeline_.checked = {}
    }
    //check if git_status.dirty
    if (git_status.dirty) {
      //check if git_status_timeline.commit exists
      if (!git_status_timeline_.commit) {
        //add dirty to commit
        git_status_timeline_.commit = {
          'title': 'Commit',
          'color': '#87a2c7',
          'action': {
            'label': 'Commit Changes',
            'onClick': () => setShowModalCommit(true)
          }
        }
        git_status_timeline_.push_request = {}
        git_status_timeline_.checked = {}
      }
      git_status_timeline_.commit.subtitle = 'changes to be committed'
    }
    //check if git_status.ahead > 0
    if (git_status.ahead > 0) {
      if (!git_status_timeline_.push_request) {
        git_status_timeline_.push_request = {
          'title': 'Push Request',
          'color': '#87a2c7',
          'subtitle': git_status.ahead+' commits ahead',
          'action': {
            'label': 'Push changes to remote',
            'onClick': () => {handleClickActionButton('push')}
          }
        }
        git_status_timeline_.checked = {}
      }
      git_status_timeline_.push_request.subtitle = git_status.ahead + ' commits ahead'
    }
    //check if git_status_timeline.checked exists
    if (!git_status_timeline_.checked) {
      git_status_timeline_.checked = {
        'color': '#5cb85c'
      }
    }
    return git_status_timeline_
  }


  if (loading) {
    return(
      LoadingBlock(loadingMessage)
    )
  }
  if(error) {
    return(AxiosError(errorMessage))
  }
  else{
    return (
      <>
        <div className="component centered">
          <Timeline minEvents={4} placeholder>
            <TimelineEvent
              icon={BsCloudDownload}
              {...git_status_timeline.pull_request}
            />
            <TimelineEvent
              icon={FiGitCommit}
              {...git_status_timeline.commit}
            />
            <TimelineEvent
              icon={BsCloudUpload}
              {...git_status_timeline.push_request}
            />
            <TimelineEvent
              icon={AiOutlineCheck}
              {...git_status_timeline.checked}
            />
          </Timeline>
        </div>
        <Modal show={ShowModalCommit} onHide={() => setShowModalCommit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Commit message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="summary_message">Summary message</label>
            <input type="text" className="form-control" id="summary_message" placeholder="Enter summary message" onChange={(e) => setCommitMessage(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="description_message">Description message</label>
            <textarea className="form-control" id="description_message" rows="3" onChange={(e) => setCommitDescription(e.target.value)}></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={() => setShowModalCommit(false)}>Close</button>
          <button type="button" className="btn btn-primary" onClick={() => handleCommit()}>Commit</button>
        </Modal.Footer>
      </Modal>
    </>
    )
  }
}

export default DatacrateGitStatus
