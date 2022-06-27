import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import ReactLoading from 'react-loading';
import {BASE_URL_SERVER} from '../App.js';
import {MdSchedule, MdError} from 'react-icons/md';
import {BsFillCheckCircleFill} from 'react-icons/bs';
import "../css/taskbar.css";

function TaskBar(props) {
  // get variables from props
  const [Loading, setLoading] = useState(false);
  const [Taskcompleted, setTaskcompleted] = useState(false);
  const [Taskfailed, setTaskfailed] = useState(false);
  const [Taskrunning, setTaskrunning] = useState(false);
  const [TaskRequest, setTaskRequest] = useState(props.TaskRequest);
  const [TaskDescription, setTaskDescription] = useState(props.TaskDescription);
  const [TaskResponse, setTaskResponse] = useState("");
  const [RequestType, setRequestType] = useState(props.TypeRequest);
  const targetsuccess = props.targetsuccess;
  //const to perform axios request here
  const PerformTask = async () => {
    setLoading(true);
    console.log(TaskRequest);
    axiosRetry(axios, {retries: 3});
    setTaskrunning(true);
    axios.get(BASE_URL_SERVER+'apiv1/tasks/'+ TaskRequest)
      .then(res => {
        console.log(res.data.data);
        setTaskResponse(res.data.data);
        setTaskrunning(false);
        setTaskcompleted(true);
        targetsuccess(true);
      }
      )
      .catch(error => {
        console.log(error);
        setTaskfailed(true);
        setTaskrunning(false);
        setTaskResponse(error.message);
      }
      );
    }

  // child component to determine the icon to display according to the task status 
  const TaskIcon = () => {
    if(Taskcompleted){
      return <BsFillCheckCircleFill color="green" size={40}/>
    }
    else if(Taskfailed){
      return <MdError size={40} color="red"/>
    }
    else if(Taskrunning){
      //return circular loading icon from reactloading
      return <ReactLoading type="spinningBubbles" color="orange" height={'40px'} width={'40px'} />
    }
    else{
      return <MdSchedule size={40} color="#006582"/>
    }
  }

  // child component to determine the text to display according to the task status
  const TaskRow = () => {
    if(Taskcompleted){
      return <div className='taskrow success'><TaskIcon></TaskIcon><p>{TaskResponse}</p></div>
    }
    else if(Taskfailed){
      return <div className='taskrow error'><TaskIcon></TaskIcon><p>{TaskResponse}</p></div>
    }
    else if(Taskrunning){
      return <div className='taskrow running'><TaskIcon></TaskIcon><p>{TaskDescription}</p></div>
    }
    else{
      return <div className='taskrow pending'><TaskIcon></TaskIcon><p>{TaskDescription}</p></div>
    }
  }

  
  //useEffect to fetch the data
  useEffect(() => {
    PerformTask();
  }, []);


  //link the profiles to the space id
  return (
    <div>
      <TaskRow></TaskRow>
    </div>
  )
    
}

export default TaskBar