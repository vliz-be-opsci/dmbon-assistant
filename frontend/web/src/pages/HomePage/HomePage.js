import { Link, routes } from '@redwoodjs/router';
import { MetaTags } from '@redwoodjs/web';
import { useRef, useState , useEffect} from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { getCheckSetup, getFolderSetup, getSshCheck, BASE_URL_SERVER } from 'src/utils/AxiosRequestsHandlers';
import {GiMaterialsScience} from 'react-icons/gi';
import TaskBar from 'src/components/TaskBar/TaskBar';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';

const HomePage = () => {
  /*
  const inputref = useRef()
  const addingSpace = useStore((state) => state.addSpace)
  const add = () => {
    const value = inputref.current.value
    console.log(value)
    if (value) {
      addingSpace(value)
    }
  }

  <input type="text" ref={inputref}></input>
  <button onClick={add}>Add Space</button>
  {all_spaces.map(space => (
    <Taskbox type="running" name={space} description={space + " description"} />
  ))}
  const all_spaces = useStore((state) => state.spaces)
  */

  //define all constants first
  //All the functions here
  const [show, setShow] = useState(false);
  const [setupready, setSetupReady] = useState(false);
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
      await axios.get(BASE_URL_SERVER+'/tasks/checkcompletestatus')
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
          const response = await axios.get(BASE_URL_SERVER+'/tasks/finishsetup');
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
      <MetaTags title="Home" description="Home page" />
      <main>
        <div>
            <section className="blue">
                <h1 className='align_self_base'>Our vision</h1>
                <div className='flex'><GiMaterialsScience className='react_icon'></GiMaterialsScience><p>We believe in open and transparent management of data in order to facilitate discovery, in line with the FAIR principles.</p></div>
                <div className='flex'><GiMaterialsScience className='react_icon'></GiMaterialsScience><p>We believe that researchers should be able to easily search through scientific data, similar to how they would perform a web search.</p></div>
                <div className='flex'><GiMaterialsScience className='react_icon'></GiMaterialsScience><p>For scientific data to be FAIR and useful for search queries, it must adhere to specific rules to make it easy for others to discover, filter, and reuse the data.</p></div>
                <div className='flex'><GiMaterialsScience className='react_icon'></GiMaterialsScience><p>Ideally, tools should exist to make it easy for data gatherers to upload and distribute meaningful data.</p></div>
                <div className='flex'><GiMaterialsScience className='react_icon'></GiMaterialsScience><p>This project aims to assist people in uploading their data (including metadata) to the web, with the goal of supporting complex search queries on distributed datasets in future projects.</p></div>
                <img src={"https://raw.githubusercontent.com/vliz-be-opsci/dmbon-assistant/main/img/diagrams/envisioned-ecosystem-black.svg"} alt="Envisioned ecosystem" className='no_background_png'/>
                <i>
                A schematic overview of our vision: FAIR and distributed access to data and metadata using complex queries.
                (1.) A user uploads heterogeneous data using DMBON assistant. Our service first ensures the FAIR principle by packaging data in an RO-crate that contains the necessary metadata.
                Then another service generates miniature webpages from every individual RO-crate, which can be easily accessed using any browser to preview data.
                (2.) The distributed data lives on the web (e.g., using cloud services) and is summarized in a knowledge graph which can be queried using complex queries.
                (3.) When other users provide queries, the search engine summarizes the data that matches the query conveniently in a table to be used for analysis.
                </i>
            </section>
            <section className="dark">
                <h2 className='underline'>How does it work?</h2>
                <img src={"https://raw.githubusercontent.com/vliz-be-opsci/dmbon-assistant/main/img/diagrams/dmbon-assistant-black.svg"} alt="Envisioned ecosystem explanation" className='no_background_png'/>
                <p>On the left, we see a user that has multiple sources of data and metadata. These can range from raw data and metadata to (source code to) analyses and publications. Importantly, much of the raw data is often uploaded to some external cloud service (such as ENA for DNA sequence information). As such, links to the raw data can be provided as well!</p>
                <p>DMBON assistant, here highlighted in blue, provides an easy way of uploading heterogeneous data using any browser! Hidden under the hood, DMBON assistant ensures that the data description conforms to the data management plan of the organization. Finally, the assistant generates a publishable Research Object Crate (RO-crate) that neatly packages heterogeneous research data with their metadata. Explain the general premise of DMBON-assistant</p>
                <p>As such, using DMBON assistant greatly simplifies generation of FAIR research object crates by:</p>
                <ul>
                    <p>- Providing a simple interface to upload data and metadata</p>
                    <p>- Ensuring that the data description conforms to the data management plan of the organization</p>
                    <p>- Generating a publishable Research Object Crate (RO-crate) that neatly packages heterogeneous research data with their metadata</p>
                </ul>
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
                  <h2>Who are we?</h2>
                  <p>
                  We are a dynamic and passionate team of six individuals working towards the advancement of open science. Our team comprises of experts in various fields, including data science, computational biology, and psychology. We are driven by the belief that scientific knowledge should be freely accessible to all, and we work tirelessly to make this a reality. Our team members are not only highly skilled in their respective areas of expertise, but they are also enthusiastic about learning and experimenting with new technologies. We are constantly pushing the boundaries of what is possible in our field and are excited to see the impact of our research on the world. Join us in our mission to make science more open, accessible, and inclusive.
                  </p>
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
        </div>
      </main>
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
                setShow(false);
                //window.location.href = "/";
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
