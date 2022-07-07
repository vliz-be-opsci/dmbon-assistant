import { getGitStatus } from "src/utils/AxiosRequestsHandlers";
import { useState, useEffect } from "react";
import AxiosError from "../AxiosError/AxiosError";
import LoadingBlock from "../LoadingBlock/LoadingBlock";
import {BsCloudDownload, BsCloudUpload} from 'react-icons/bs';
import {FiGitCommit} from 'react-icons/fi';
import {AiOutlineCheck} from 'react-icons/ai';
import './DatacrateGitStatus.css';

const DatacrateGitStatus = (datacrate_uuid) => {

  const [loading, setLoading] = useState(true);
  const [git_status, setGitStatus] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [git_icons_status, setGitIconsStatus] = useState({});

  useEffect(() => {
    getGitStatus(datacrate_uuid)
      .then(res => {
        console.log(res.data)
        setGitStatus(res.data);
        determineIconColor(res.data);
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

  //function to determine what icons need to be colored in
  const determineIconColor = (git_status) => {
    if(git_status.behind > 0){
      setGitIconsStatus({
        commit: 'icon',
        push: 'icon',
        pull: 'icon active',
        check: 'icon'
      });
      return
    }
    if(git_status.ahead > 0){
      setGitIconsStatus({
        commit: 'icon',
        push: 'icon active',
        pull: 'icon',
        check: 'icon'
      })
      return
    }
    if(git_status.dirty){
      setGitIconsStatus({
        commit: 'icon active',
        push: 'icon',
        pull: 'icon',
        check: 'icon'
      })
      return
    }
    else{
      setGitIconsStatus({
        commit: 'icon',
        push: 'icon',
        pull: 'icon',
        check: 'icon active'
      })
      return
    }
  }


  if (loading) {
    return(
      LoadingBlock("Git Status")
    )
  }
  if(error) {
    return(AxiosError(errorMessage))
  }
  else{
    return (
      <div className="component">
        <div className="title">Git Status</div>
        <div className="statusmessage">{git_status.message}</div>
        <section className="timeline-wrapper">
            <div className="middle-line"></div>
            <div className="box box-top">
                <div className={git_icons_status.pull}>
                    <BsCloudDownload></BsCloudDownload>
                </div>
            </div>
            <div className="box box-top">
                <div className={git_icons_status.commit}>
                    <FiGitCommit></FiGitCommit>
                </div>
            </div>
            <div className="box box-top">
                <div className={git_icons_status.push}>
                    <BsCloudUpload></BsCloudUpload>
                </div>
            </div>
            <div className="box box-bottom">
                <div className={git_icons_status.check}>
                    <AiOutlineCheck></AiOutlineCheck>
                </div>
            </div>
        </section>
		  </div>
    )
  }
}

export default DatacrateGitStatus
