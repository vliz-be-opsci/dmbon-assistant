import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import ReactLoading from 'react-loading';

import {MdFastfood} from 'react-icons/md';
import {AiOutlinePullRequest} from 'react-icons/ai';
import {RiGitRepositoryCommitsFill} from 'react-icons/ri';
import {GoRepoPush} from 'react-icons/go';
import {IoMdCheckmarkCircleOutline} from 'react-icons/io';
import {BsArrowRepeat} from 'react-icons/bs';
import {FaLaptopCode, FaHotel} from 'react-icons/fa';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';

import '../css/timeline_git.css';


function TimeLineGit(props) {
    //const
    const {SpaceId} = useParams();
    const [Loading, SetLoading] = useState(false);
    const [repo_dirty, SetRepoDirty] = useState(props.dirty);
    const [ahead, SetAhead] = useState(props.ahead);
    const [behind, SetBehind] = useState(props.behind);

    console.log(repo_dirty + " " + ahead + " " + behind);
    //get props from parent

    //functions
    //function that makes an axios call to pull data from git for the current spaceid git/pull
    const gitPull = async() => {
        SetLoading(true);
        if(SpaceId){
          axios.post(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/git/pull/`,{})
          .then(res => {
              console.log(res)
              window.location.reload();
          })
        }
      }
  
      //function that makes an axios call to push data from git for the current spaceid git/push
      const gitPush = async() => {
        SetLoading(true);
        if(SpaceId){
          axios.post(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/git/push/`,{})
          .then(res => {
              console.log(res)
              window.location.reload();
          })
        }
      }

    //hava a function for each type of timeline item

    //pullfunction
    const Timelinepull = () => {
        if(behind > 0){
            var message_behind = behind + " commits behind";
            if(behind > 1){
                message_behind = behind + " commits behind";
            }else{
                message_behind = behind + " commit behind";
            }
            return(
                <TimelineItem>
                    <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
                        align="right"
                        variant="body2"
                        color="black"
                    >
                        <b>{message_behind}</b>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color="error" className='selected'>
                            <AiOutlinePullRequest className='selected-icon' onClick={gitPull}/>
                        </TimelineDot>
                        <TimelineConnector sx={{ bgcolor: 'error.main' }}/>
                    </TimelineSeparator>
                    <TimelineContent ></TimelineContent>
                </TimelineItem>
            )
        }else{
            var message_behind = "nothing to pull";
            return(
                <TimelineItem>
                    <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
                        align="right"
                        variant="body2"
                        color="text.secondary"
                    >
                        {message_behind}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot >
                            <AiOutlinePullRequest />
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent ></TimelineContent>
                </TimelineItem>
                )
        }
    }

    //commit function
    const TimelineCommit = () => {
        if(repo_dirty){
            if(behind > 0){
                return(
                    <>
                    <TimelineItem>
                        <TimelineOppositeContent
                            sx={{ m: 'auto 0' }}
                            variant="body2"
                            color="text.secondary"
                        >
                            nothing to commit
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineConnector />
                            <TimelineDot>
                                <RiGitRepositoryCommitsFill/>
                            </TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent></TimelineContent>
                    </TimelineItem>
                    </>
                )
            }
            else{
                return(
                    <>
                    <TimelineItem>
                        <TimelineOppositeContent
                            sx={{ m: 'auto 0' }}
                            variant="body2"
                            color="black"
                        >
                            <b>commit changes</b>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineConnector />
                            <TimelineDot color="warning" className='selected'>
                            <a href={`/spaces/${SpaceId}/git`}>
                                <RiGitRepositoryCommitsFill className='selected-icon'/>
                            </a> 
                            </TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent></TimelineContent>
                    </TimelineItem>
                    </>
                )
            }
        }else{
            return(
                <>
                <TimelineItem>
                    <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
                        variant="body2"
                        color="text.secondary"
                    >
                        nothing to commit
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot>
                            <RiGitRepositoryCommitsFill/>
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent></TimelineContent>
                </TimelineItem>
                </>
            )
        }
    }

    //push function
    const TimelinePush = () => {
        if(ahead > 0){
            var message_ahead = ahead + " commits ahead";
            if(ahead > 1){
                message_ahead = ahead + " commits ahead";
            }else{
                message_ahead = ahead + " commit ahead";
            }
            if(behind > 0 || repo_dirty){
                return(
                    <TimelineItem>
                        <TimelineOppositeContent
                            sx={{ m: 'auto 0' }}
                            variant="body2"
                            color="text.secondary"
                            >
                            {message_ahead}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineConnector />
                                <TimelineDot >
                                    <GoRepoPush/>
                                </TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent></TimelineContent>
                    </TimelineItem>
                )
                
            }
            else{
                return(
                    <TimelineItem>
                        <TimelineOppositeContent
                            sx={{ m: 'auto 0' }}
                            variant="body2"
                            color="text.secondary"
                            >
                            <b>{message_ahead}</b>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineConnector />
                                <TimelineDot color="warning" className='selected'>
                                    <GoRepoPush className='selected-icon' onClick={gitPush}/>
                                </TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent></TimelineContent>
                    </TimelineItem>
                )
                
            }
        }else{
            return(
                <>
                <TimelineItem>
                    <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
                        variant="body2"
                        color="text.secondary"
                    >
                        nothing to push
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot>
                            <GoRepoPush/>
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent></TimelineContent>
                </TimelineItem>
                </>
            )
        }
    }

    //if everything is ok 
    const TimelineEverythingOk = () => {
        if(!repo_dirty && ahead === 0 && behind === 0){
            return(
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineConnector/>
                        <TimelineDot color="success" className='selected'>
                            <IoMdCheckmarkCircleOutline className='selected-icon'/>
                        </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent></TimelineContent>
                </TimelineItem>
            )
        }else{
            return(
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineConnector/>
                        <TimelineDot>
                            <IoMdCheckmarkCircleOutline/>
                        </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent></TimelineContent>
                </TimelineItem>
            )
        }
    }
        
    //render
    if(Loading){
        return(
            <div class="busy">
                <ReactLoading type='bars' color='#006582' height={'20vw'} width={'20vw'} />
            </div>
        )
    }else{
        return (
            <>
            <Timeline align="alternate" position="alternate" className='timeline-big'>
                <Timelinepull/> 
                <TimelineCommit/>
                <TimelinePush/>
                <TimelineEverythingOk/>
            </Timeline>
            </>
        )
    }
}
    

export default TimeLineGit