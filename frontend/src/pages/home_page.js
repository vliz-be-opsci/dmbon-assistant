import '../css/home_page.css';
import {useEffect, useState} from 'react';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";
import axios from 'axios';
import Footer from '../components/footer';
import { Form, FloatingLabel,Modal } from 'react-bootstrap';
import {MdSchedule, MdError} from 'react-icons/md';
import {BsFillCheckCircleFill} from 'react-icons/bs';
import TaskBar from '../components/taskbar';
import {BASE_URL_SERVER} from '../App.js';
import $ from 'jquery';
import ReactLoading from 'react-loading';
import "../css/taskbar.css";

function HomePage() {

//define all constants first
  //All the functions here
    const [show, setShow] = useState(false);
    const [setupready, setSetupReady] = useState(true);
    const [username, setUsername] = useState('');
    const [ORCID, setORCID] = useState('');
    const [PerformTaskForm, setPerformTaskForm] = useState(false);
    const [Taskcompleted, setTaskcompleted] = useState(false);
    const [Taskfailed, setTaskfailed] = useState(false);
    const [Taskrunning, setTaskrunning] = useState(false);
    const [TaskResponse, setTaskResponse] = useState("");
    const [SSHsetupsuccess, setSSHsetupsuccess] = useState(false);
    const [Userdatasetupsucess, setUserdatasetupsucess] = useState(false);
    const [Folderstructuresetupsucess, setFolderstructuresetupsucess] = useState(false);
    const [Continuebuttontext, setContinuebuttontext] = useState("Complete setup first");
    const taskpayload = []

    //check if SSH setup is done and if folder structure is done
    const checkifsetupdone = () => {
        if(SSHsetupsuccess && Folderstructuresetupsucess){
            setContinuebuttontext("Continue");
            setSetupReady(false);
        }
    }

    //axios request get to tasks/checkcompletestatus 
    const checkcompletestatus = async () => {
        await axios.get(BASE_URL_SERVER+'apiv1/tasks/checkcompletestatus')
        .then(res => {
            console.log(res.data);
        })
        .catch(error => {
            setShow(true);
        }
        )
    }


    //perform axios get request to tasks/finishsetup
    const finishsetup = async () => {
        try {
            const response = await axios.get(BASE_URL_SERVER+'apiv1/tasks/finishsetup');
            console.log(response.data);
            setSSHsetupsuccess(true);
            setUserdatasetupsucess(true);
            setFolderstructuresetupsucess(true);
            setSetupReady(false);
            checkifsetupdone();
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        checkcompletestatus();
        checkifsetupdone();
    }
    ,[SSHsetupsuccess, Folderstructuresetupsucess]);


    return (
        <>
        <div>
            <section className="blue">
                <h2>DM-BON Assistant</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </section>
            <section className="dark">
                <h2>TODO have a section for the user to create a new space</h2>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <div class="custom-shape-divider-top-1649669784">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
                    </svg>
                </div>
            </section>
            <div className="sidebox_one counterclockwise_turned"></div>
            <div className="sidebox_two clockwise_turned"></div>
            <section className="light">
                <AnimationOnScroll animateIn="animate__fadeInLeft" animateOut="animate__bounceOutRight" duration="0.7">
                    <h2>TODO have a section for the user to create a new space</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus libero leo, pellentesque ornare, adipiscing vitae, rhoncus commodo, nulla. Fusce quis ipsum. Nulla neque massa, feugiat sed, commodo in, adipiscing ut, est. In fermentum mattis ligula.</p>
                </AnimationOnScroll>
                <div>
                <svg className="blob-motion" id="visual" viewBox="0 0 960 330" width="960" height="330" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1">
                    <rect x="0" y="0" width="960" height="330" fill="#6cb2c5"></rect>
                    <g transform="translate(471.1486233589775 170.3596269558737)">
                        <path id="blob1" d="M51.6 -99.6C66.4 -80.7 77.9 -66.1 90.9 -50.3C103.9 -34.4 118.4 -17.2 125.8 4.2C133.1 25.7 133.2 51.3 123.1 72.1C112.9 92.9 92.5 108.8 70.2 120.3C48 131.8 24 138.9 -0.7 140.1C-25.3 141.2 -50.7 136.4 -66.8 121.4C-83 106.4 -90 81.2 -97.5 59.3C-105 37.3 -113 18.7 -113.3 -0.2C-113.6 -19 -106.2 -38 -99.2 -60.8C-92.2 -83.6 -85.6 -110.2 -69.1 -128.2C-52.7 -146.2 -26.3 -155.6 -4 -148.7C18.3 -141.8 36.7 -118.5 51.6 -99.6" fill="#2c3e50"></path>
                    </g>
                </svg>
                </div>
            </section>
            <div className="spacer layer1"></div>
            
            <section className="blue">
                <h2>TODO have a section for the user to create a new space</h2>
                <p>Nulla ipsum. Vestibulum condimentum condimentum augue. Nunc purus risus, volutpat sagittis, lobortis at, dignissim sed, sapien. Fusce porttitor iaculis ante. Curabitur eu arcu. Morbi quam purus, tempor eget, ullamcorper feugiat, commodo ullamcorper, neque.</p>
            </section>
            <Footer />
        </div>
        <Modal show = {show} size="lg">
            <Modal.Header>
                <Modal.Title>Welcome to the site new user!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Set up the DMBON assistent by filling in the form below.
                </p>
                <TaskBar TaskRequest = "foldersetup" TaskDescription="Setting up folder structure for first usage" TypeRequest="get" targetsuccess = {setFolderstructuresetupsucess} TaskPayload={taskpayload}/>
                <TaskBar TaskRequest = "sshcheck" TaskDescription="Checking if ssh key exists and is connected" TypeRequest="get"  targetsuccess = {setSSHsetupsuccess} TaskPayload={taskpayload}/>
            </Modal.Body>
            <Modal.Footer>
                <button disabled={setupready} className="btn modalbutton large" onClick={() => {
                    finishsetup();
                    window.location.href = "/";
                }
                }>
                    {Continuebuttontext}
                </button>
            </Modal.Footer>
        </Modal>
        </>
        
    )
}

export default HomePage