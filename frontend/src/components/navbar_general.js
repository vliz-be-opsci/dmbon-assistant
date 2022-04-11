//import some css here
import 'bootstrap/dist/css/bootstrap.min.css'
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';
import {FaHome, FaFolderOpen, FaGitAlt, FaCog, FaFlask} from 'react-icons/fa';

function NavBar() {
    const url = window.location.href;
    const spaceid = url.split('/')[4]
    console.log(spaceid);
    if (url.includes("spaces")) {
        if (spaceid){
            return (
                <div className="container">
                    <Navbar bg="light" expand="lg">
                        <Container>
                            <Navbar.Brand href="/"><FaHome size="1.5em"/></Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto justify-content-center">
                                <Nav.Link href= {`/spaces/${spaceid}/`}><FaFlask size="1.5em"/></Nav.Link>
                                <Nav.Link href= {`/spaces/${spaceid}/files`}><FaFolderOpen size="1.5em"/></Nav.Link>
                                <Nav.Link href= {`/spaces/${spaceid}/git`}><FaGitAlt size="1.5em"/></Nav.Link>
                            </Nav>
                            <Nav className="justify-content-end">
                                <Nav.Link href= {`/spaces/${spaceid}/settings`}><FaCog size="1.5em"/></Nav.Link>
                            </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div>
            )
        }else{
            return (
                <div className="container">
                    <Navbar bg="light" expand="lg">
                        <Container>
                            <Navbar.Brand href="/"><FaHome /> DM-BON manager</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/">Profiles</Nav.Link>
                            </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div>
            )
        }     
    } else {
        return (
            <div className="container">
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand href="/"><FaHome /> DM-BON manager</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Profiles</Nav.Link>
                            <Nav.Link href="/spaces">Spaces</Nav.Link>
                            <NavDropdown title="Settings" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div> 
        )
    }
}

export default NavBar