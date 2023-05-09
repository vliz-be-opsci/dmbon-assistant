import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import ReactLoading from 'react-loading';
import { Form, FloatingLabel} from 'react-bootstrap';
import {BASE_URL_SERVER} from 'src/utils/AxiosRequestsHandlers';
import {MdSchedule, MdError} from 'react-icons/md';
import {BsFillCheckCircleFill} from 'react-icons/bs';
import $ from 'jquery';
import "./TaskBar.css";

const TaskBar = (props) => {
   // get variables from props
   const [Loading, setLoading] = useState(false);
   const [Taskcompleted, setTaskcompleted] = useState(false);
   const [Taskfailed, setTaskfailed] = useState(false);
   const [Taskrunning, setTaskrunning] = useState(false);
   const [TaskRequest, setTaskRequest] = useState(props.TaskRequest);
   const [TaskType, setTaskType] = useState(props.TypeRequest);
   const [TaskDescription, setTaskDescription] = useState(props.TaskDescription);
   const [TaskPayload, setTaskPayload] = useState(props.TaskPayload);
   const [TaskResponse, setTaskResponse] = useState("");
   const targetsuccess = props.targetsuccess;
   const [lasttask, setLasttask] = useState("");
   const [UserfilledInpayload, setUserfilledInpayload] = useState({});
   //const to perform axios request here
   const PerformTask = async (props) => {
       try {
         const payload = props.Payload;
         const task = props.Task;
         axiosperformance({"Task": task, "Payload": payload});
       } catch (error) {
         const payload = TaskPayload;
         const task = TaskRequest;
         axiosperformance({"Task":task, "Payload": payload});
       }
     }
 
   const axiosperformance = async (props) => {
     const payload = props.Payload;
     const task = props.Task;
     console.log(Object.keys(payload).length);
     console.log(task);
     setTaskfailed(false);
       //check if there is a payload
       if(payload.length > 0 || Object.keys(payload).length > 0){
         // check if all fields are filled in
         console.log(payload);
         setLasttask(TaskRequest);
         setLoading(true);
         console.log(TaskRequest);
         console.log(TaskPayload);
         /*axiosRetry(axios, {retries: 3});*/
         setTaskrunning(true);
         axios.post(BASE_URL_SERVER+'/tasks/'+ task, payload)
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
                 PerformTask({"Task": res.data.next_task.TaskRequest, "Payload": res.data.next_task.Payload});
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
       }else{
         setLasttask(TaskRequest);
         setLoading(true);
         console.log(TaskRequest);
         console.log(TaskPayload);
         /*axiosRetry(axios, {retries: 3});*/
         setTaskrunning(true);
         axios.get(BASE_URL_SERVER+'/tasks/'+ task)
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
                 PerformTask({"Task": res.data.next_task.TaskRequest, "Payload": res.data.next_task.Payload});
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
     setUserfilledInpayload([]);
     setTaskPayload([]);
     PerformTask({"Task": TaskRequest, "Payload": userpayload});
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
         return <div className='taskrow success'><TaskIcon></TaskIcon><p> <div dangerouslySetInnerHTML={{__html: TaskResponse}}></div></p></div>
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
