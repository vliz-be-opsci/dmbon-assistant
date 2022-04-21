//import some css here
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect} from 'react';
import {Navbar, Container, Nav, NavDropdown, Dropdown} from 'react-bootstrap';
import {FaHome, FaFolderOpen, FaGitAlt, FaCog} from 'react-icons/fa';
import {GoSettings} from 'react-icons/go';
import {RiOrganizationChart} from 'react-icons/ri';
import {GiCargoCrate} from 'react-icons/gi';
import Badge from '@mui/material/Badge';
import axios from 'axios';
import '../css/navbar.css';
import {BASE_URL_SERVER} from '../App.js';

function NavBar() {
    const [Spacename, SetSpaceName] = useState("");
    const url = window.location.href;
    const spaceid = url.split('/')[4]
    const url_array = url.split('/')
    const end_url = url_array[url_array.length-1]
    const [ShaclOverview, SetShaclOverview] = useState([{}]);
    const [ShaclErrors, SetShaclErrors] = useState(0);
    const [repo_dirty, SetRepoDirty] = useState(false);
    const [ahead, SetAhead] = useState(0);
    const [behind, SetBehind] = useState(0);

    //get space name via axios request and set it to state
    const fetchSpaceName = async() => {
        axios.get(BASE_URL_SERVER+`apiv1/spaces/${spaceid}`)
        .then(res => {
            console.log(res)
            var space_name_array = res.data.storage_path.replace('\\','/').split('/');
            var space_name = space_name_array[space_name_array.length-1];
            console.log(space_name);
            SetSpaceName(space_name);
        })
    }

    //get the shacl overiew if a space was selected 
    const fetchShaclOverview = async() => {
        if(spaceid){
            axios.get(BASE_URL_SERVER+`apiv1/spaces/${spaceid}/annotation/shacl_report`)
            .then(res => {
                console.log(res)
                var shacl_requirements = res.data.shacl_requirements;
                console.log(shacl_requirements);
                SetShaclOverview(shacl_requirements);

                //get the number of shacl errors that are in shacl_requirements
                try{var ammount_violations = shacl_requirements[0]["http://www.w3.org/ns/shacl#result"].length;console.log(ammount_violations);SetShaclErrors(ammount_violations);}
                catch(error){console.log(error);var ammount_violations = 0;}
            })
            
            //do axios request to get the git status /git/status
            axios.get(BASE_URL_SERVER+`apiv1/spaces/${spaceid}/git/status/`)
            .then(res => {
                console.log(res)
                var git_status = res.data;
                console.log(git_status);
                SetRepoDirty(git_status.dirty);
                SetAhead(git_status.ahead);
                SetBehind(git_status.behind);
            })
        }   
    }

    const BadgeGit = () => {
        if(repo_dirty){
            if(behind > 0){
                return(
                    <Badge className="badge-git" color="error" anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }} badgeContent={behind}>
                        <Badge className="badge-git" color="warning" anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }} variant="dot">
                            <FaGitAlt size="2em"></FaGitAlt>
                        </Badge>
                    </Badge>
                )
            }else{
                return(
                    <Badge className="badge-git" color="warning" variant='dot'>
                        <FaGitAlt size="2em"></FaGitAlt>
                    </Badge>
                )
            }
        }
        if(ahead > 0){
            if(behind > 0){
                return(
                    <Badge className="badge-git" color="error" anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }} badgeContent={behind}>
                        <Badge className="badge-git" color="warning" anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }} badgeContent={ahead}>
                            <FaGitAlt size="2em"></FaGitAlt>
                        </Badge>
                    </Badge>
                )
            }else{
                return(
                    <Badge className="badge-git" color="warning" badgeContent={ahead}>
                        <FaGitAlt size="2em"></FaGitAlt>
                    </Badge>
                )
            }
        }
        if(behind > 0){
            if(ahead > 0){
                return(
                    <Badge className="badge-git" color="error" anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }} badgeContent={behind}>
                        <Badge className="badge-git" color="warning" anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }} badgeContent={ahead}>
                            <FaGitAlt size="2em"></FaGitAlt>
                        </Badge>
                    </Badge>
                )
            }else{
                return(
                    <Badge className="badge-git" color="error" anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }} badgeContent={behind}>
                        <FaGitAlt size="2em"></FaGitAlt>
                    </Badge>
                )
            }
        }
        if(ahead == 0 && behind == 0 && repo_dirty != true){
            return(
                <Badge color="success" variant="dot">
                    <FaGitAlt size="2em"></FaGitAlt>
                </Badge>
            )
        }
    }


    const BadgeFolder = () => {
        if(ShaclErrors > 0){
            return(
                <Badge color="error" badgeContent={ShaclErrors}>
                    <FaFolderOpen size="2em"/>
                </Badge>
            )
        }else{
            return(
                <FaFolderOpen size="2em"/>
            )
        }
    }


    useEffect(() => {
        fetchSpaceName();
        fetchShaclOverview();
    }, [])

    console.log(spaceid);
    if (url.includes("spaces")) {
        if (spaceid){
            if(end_url.includes("git")){
                return (
                    <>
                    <div className="container">
                        <Navbar expand="lg" className='bluebar'>
                            <Container>
                                <Navbar.Brand href="/"><p className='bluebar_button'><FaHome size="2em"/></p></Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto justify-content-center">
                                    <Nav.Link href= {`/spaces/${spaceid}/`}><p className='bluebar_button '>{Spacename}</p></Nav.Link>
                                    <Nav.Link href= {`/spaces/${spaceid}/files`}><p className='bluebar_button'><BadgeFolder/></p></Nav.Link>
                                    <Nav.Link href= {`/spaces/${spaceid}/git`}><p className='bluebar_button activito'><BadgeGit/></p></Nav.Link>
                                </Nav>
                                <Nav className="justify-content-end">
                                    <Nav.Link href= {`/spaces/${spaceid}/settings`}><p className='bluebar_button'><FaCog size="2em"/></p></Nav.Link>
                                </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                    </div>
                    </>
                )
            }
            if(end_url.includes("files")){
                return (
                    <>
                    <div className="container">
                        <Navbar expand="lg" className='bluebar'>
                            <Container>
                                <Navbar.Brand href="/"><p className='bluebar_button'><FaHome size="2em"/></p></Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto justify-content-center">
                                    <Nav.Link href= {`/spaces/${spaceid}/`}><p className='bluebar_button'>{Spacename}</p></Nav.Link>
                                    <Nav.Link href= {`/spaces/${spaceid}/files`}><p className='bluebar_button activito'><BadgeFolder/></p></Nav.Link>
                                    <Nav.Link href= {`/spaces/${spaceid}/git`}><p className='bluebar_button'><BadgeGit/></p></Nav.Link>
                                </Nav>
                                <Nav className="justify-content-end">
                                    <Nav.Link href= {`/spaces/${spaceid}/settings`}><p className='bluebar_button'><FaCog size="2em"/></p></Nav.Link>
                                </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                    </div>
                    </>
                )
            }
            if(end_url.includes("settings")){
                return (
                    <>
                    <div className="container">
                        <Navbar expand="lg" className='bluebar'>
                            <Container>
                                <Navbar.Brand href="/"><p className='bluebar_button'><FaHome size="2em"/></p></Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto justify-content-center">
                                    <Nav.Link href= {`/spaces/${spaceid}/`}><p className='bluebar_button'>{Spacename}</p></Nav.Link>
                                    <Nav.Link href= {`/spaces/${spaceid}/files`}><p className='bluebar_button'><BadgeFolder/></p></Nav.Link>
                                    <Nav.Link href= {`/spaces/${spaceid}/git`}><p className='bluebar_button'><BadgeGit/></p></Nav.Link>
                                </Nav>
                                <Nav className="justify-content-end">
                                    <Nav.Link href= {`/spaces/${spaceid}/settings`}><p className='bluebar_button activito'><FaCog size="2em"/></p></Nav.Link>
                                </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                    </div>
                    </>
                )
            }
            else{
                return (
                    <>
                    <div className="container">
                        <Navbar expand="lg" className='bluebar'>
                            <Container>
                                <Navbar.Brand href="/"><p className='bluebar_button'><FaHome size="2em"/></p></Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto justify-content-center">
                                    <Nav.Link href= {`/spaces/${spaceid}/`}><p className='bluebar_button activito'>{Spacename}</p></Nav.Link>
                                    <Nav.Link href= {`/spaces/${spaceid}/files`}><p className='bluebar_button'><BadgeFolder/></p></Nav.Link>
                                    <Nav.Link href= {`/spaces/${spaceid}/git`}><p className='bluebar_button'><BadgeGit/></p></Nav.Link>
                                </Nav>
                                <Nav className="justify-content-end">
                                    <Nav.Link href= {`/spaces/${spaceid}/settings`}><p className='bluebar_button'><FaCog size="2em"/></p></Nav.Link>
                                </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                    </div>
                    </>
                )
            }
            
        }else{
            return (
                <>
                <div className="container" >
                    <Navbar className="bluebar">
                        <Container>
                            <Navbar.Brand href="/" ><p className='bluebar_button'><FaHome size="2em"/></p></Navbar.Brand>
                            <Navbar.Brand href="/spaces" ><p className='bluebar_button activito'><GiCargoCrate size="2em"/></p></Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/" ><p className='bluebar_button'><RiOrganizationChart size="2em"/></p></Nav.Link>
                                
                            </Nav>
                            <Nav className="justify-content-end">
                                <Dropdown title="Settings" id="basic-nav-dropdown">
                                    <Dropdown.Toggle id='bluebar_dropdown'><GoSettings size="2em"/></Dropdown.Toggle>
                                    <Dropdown.Menu className="bluebar darkborder">
                                        <Dropdown.Item href="#action/3.1" className='bluebar_button'>Action</Dropdown.Item>
                                        <Dropdown.Item href="#action/3.2" className='bluebar_button'>Another action</Dropdown.Item>
                                        <Dropdown.Item href="#action/3.3" className='bluebar_button'>Something</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item href="#action/3.4" className='bluebar_button'>Separated link</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div>
                </> 
            )
        }     
    } else {
        return (
            <>
            <div className="container">
                <Navbar expand="lg" className="bluebar">
                    <Container>
                        <Navbar.Brand href="/"><p className='bluebar_button activito'><FaHome size="2em"/></p> </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/spaces"><p className='bluebar_button'><GiCargoCrate size="2em"/></p></Nav.Link>
                            <Nav.Link href="/"><p className='bluebar_button'><RiOrganizationChart size="2em"/></p></Nav.Link>
                        </Nav>
                        <Nav className="justify-content-end">
                            <Dropdown title="Settings" id="basic-nav-dropdown">
                                <Dropdown.Toggle id='bluebar_dropdown'><GoSettings size="2em"/></Dropdown.Toggle>
                                <Dropdown.Menu className="bluebar darkborder">
                                    <Dropdown.Item href="#action/3.1" className='bluebar_button'>Action</Dropdown.Item>
                                    <Dropdown.Item href="#action/3.2" className='bluebar_button'>Another action</Dropdown.Item>
                                    <Dropdown.Item href="#action/3.3" className='bluebar_button'>Something</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="#action/3.4" className='bluebar_button'>Separated link</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                        </Navbar.Collapse>
                        <div class="custom-shape-divider-bottom-1649755521">
                            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
                                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,928c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,326,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
                                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
                            </svg>
                        </div>
                    </Container>
                </Navbar>
            </div> 
            </>
            
        )
    }
}

export default NavBar