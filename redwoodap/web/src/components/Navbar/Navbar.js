//import react params
import React,{useState} from 'react';
import { Link, routes } from '@redwoodjs/router';
import { MetaTags } from '@redwoodjs/web';
import { isDatacratesURL, isProfilesURL, isSpacesURL, isHomepage } from 'src/utils/URLParamHandlers';
import {FaHome, FaFolderOpen, FaGitAlt, FaCog} from 'react-icons/fa';
import {GoSettings} from 'react-icons/go';
import {RiOrganizationChart} from 'react-icons/ri';
import {GiCargoCrate} from 'react-icons/gi';
import './Navbar.css';

const Navbar = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false)
  //check if the user is in the datacrates url space
  const isdatacrate = isDatacratesURL();
  const isprofile = isProfilesURL();
  const isspace = isSpacesURL();
  const ishome = isHomepage();

  const NavbarOptions = () => {
    if (isdatacrate) {
      return (
        <ul>
          <li className="left"><Link to={routes.overviewDatacrates()}><GiCargoCrate></GiCargoCrate></Link></li>
          <li><Link to={routes.settings()}><FaCog></FaCog></Link></li>
        </ul>
      )
    }
    if (isprofile) {
      return (
        <ul>
          <li className="left"><Link to={routes.overviewDatacrates()}><RiOrganizationChart></RiOrganizationChart></Link></li>
          <li><Link to={routes.settings()}><FaCog></FaCog></Link></li>
        </ul>
      )
    }
    if (isspace) {
      return (
        <ul>
          <li className="left"><Link to={routes.overviewDatacrates()}><FaFolderOpen></FaFolderOpen></Link></li>
          <li><Link to={routes.settings()}><FaCog></FaCog></Link></li>
        </ul>
      )
    }
    if (ishome) {
      return (
        <ul>
          <li className="left"><Link to={routes.overviewDatacrates()}><GiCargoCrate></GiCargoCrate></Link></li>
          <li><Link to={routes.settings()}><FaCog></FaCog></Link></li>
        </ul>
      )
    }else{
      return (
        <ul>
          <li><Link to={routes.settings()}><FaCog></FaCog></Link></li>
        </ul>
      )
    }
  }

  return (
    <nav className='navigation'>
      <Link className="brand-name" to={routes.home()}>DMBON assistant</Link>
      <button className="hamburger" onClick={() => {
          setIsNavExpanded(!isNavExpanded)
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="white"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className={isNavExpanded ? "navigation-menu expanded" : "navigation-menu"}><NavbarOptions /></div>
    </nav>
  )
}

export default Navbar
