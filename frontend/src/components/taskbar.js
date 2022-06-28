import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import ReactLoading from 'react-loading';
import { Form, FloatingLabel} from 'react-bootstrap';
import {BASE_URL_SERVER} from '../App.js';
import {MdSchedule, MdError} from 'react-icons/md';
import {BsFillCheckCircleFill} from 'react-icons/bs';
import $ from 'jquery';
import "../css/taskbar.css";

function TaskBar(props) {
  // get variables from props
  const [Loading, setLoading] = useState(false);
  const [Taskcompleted, setTaskcompleted] = useState(false);
  const [Taskfailed, setTaskfailed] = useState(false);
  const [Taskrunning, setTaskrunning] = useState(false);
  const [TaskRequest, setTaskRequest] = useState(props.TaskRequest);
  const [TaskDescription, setTaskDescription] = useState(props.TaskDescription);
  const [TaskPayload, setTaskPayload] = useState(props.TaskPayload);
  const [TaskResponse, setTaskResponse] = useState("");
  const targetsuccess = props.targetsuccess;
  const [lasttask, setLasttask] = useState("");
  const [UserfilledInpayload, setUserfilledInpayload] = useState({});
  //const to perform axios request here
  const PerformTask = async (props) => {
    if(lasttask != TaskRequest){
      //check if there is a payload
      if(TaskPayload.length > 0){
        // check if all fields are filled in
        console.log(UserfilledInpayload);
        if(Object.keys(UserfilledInpayload).length == TaskPayload.length){
          alert("Payload is not empty");
          setTaskPayload([]);
        }
      }else{
        setLasttask(TaskRequest);
        setLoading(true);
        console.log(TaskRequest);
        console.log(TaskPayload);
        /*axiosRetry(axios, {retries: 3});*/
        setTaskrunning(true);
        axios.get(BASE_URL_SERVER+'apiv1/tasks/'+ TaskRequest)
          .then(res => {
            console.log(res.data);
            setTaskResponse(res.data.data);
            setTaskrunning(false);
            setTaskcompleted(true);
            // check if the res.data.next_task is null
            console.log(res.data.next_task);
            if(res.data.next_task != null){
              console.log("going for next task")
              setTaskrunning(false);
              setTaskDescription(res.data.next_task.TaskDescription);
              setTaskPayload(res.data.next_task.Payload);
              setTaskcompleted(false);
              setTaskRequest(res.data.next_task.TaskRequest);
              if(res.data.next_task.Payload.length == 0){
                payloadtaskexecute();
              }
            }else{
              console.log("no next task");
              targetsuccess(true);
            }
          }
          )
          .catch(error => {
            setTaskfailed(true);
            setTaskrunning(false);
            setTaskResponse(error.message);
          }
          );
        }
      }
    }

  // function that will handle a payloaded axios request
  const payloadtaskexecute = async (props) => {
    setLoading(true);
    console.log(props);
    console.log(TaskRequest);
    console.log(TaskPayload);
  }


  const handleChange = (event) => {
    // loop over all the payload labels
    var userpayload = {}
    for(let i = 0; i < TaskPayload.length; i++){
      // print the label 
      console.log(TaskPayload[i].label);
      var name_to_search = "select"+TaskPayload[i].label;
      // get the value of the input by using the name_to_sezrach with jquery
      var value = $("input[name='"+name_to_search+"']").val();
      console.log(value);
      userpayload[TaskPayload[i].label] = value;
      // add the value to the UserfilledInpayload
    }
    setUserfilledInpayload(userpayload);
    payloadtaskexecute(userpayload);
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
      return <ReactLoading type="spinningBubbles" color="#006582" height={'40px'} width={'40px'} />
    }
    else{
      return <MdSchedule size={40} color="darkgrey"/>
    }
  }

  // child component to determine the text to display according to the task status
  const TaskRow = () => {
    if(TaskPayload.length > 0){
      return(
        <div className='form_userdata'>
          <h4>{TaskDescription}</h4>
            {TaskPayload.map((item, index) => {
              return (
                <>
                <Form.Group>
                    <FloatingLabel
                    label={item.description}
                    controlId="floatingInput"
                    className="mb-3"
                    >
                    <Form.Control type="text" name={"select"+item.label}/>
                    </FloatingLabel>
                </Form.Group>
                </>
              )
            })}  
            <button className='large' onClick={() => {handleChange();}}>Submit form</button>
        </div>
      )
    }else{
      if(Taskcompleted){
        return <div className='taskrow success'><TaskIcon></TaskIcon><p>{TaskResponse}</p></div>
      }
      else if(Taskfailed){
        return <div className='taskrow error'><TaskIcon></TaskIcon><p><p>{TaskDescription}</p>{TaskResponse}</p></div>
      }
      else if(Taskrunning){
        return <div className='taskrow running'><TaskIcon></TaskIcon><p>{TaskDescription}</p></div>
      }
      else{
        return <div className='taskrow pending'><TaskIcon></TaskIcon><p>{TaskDescription}</p></div>
      }
    }
  }

  
  //useEffect to fetch the data
  useEffect(() => {
    PerformTask();
  }, [TaskRequest]);


  //link the profiles to the space id
  return (
    <div>
      <TaskRow></TaskRow>
    </div>
  )
    
}

export default TaskBar