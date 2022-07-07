import { Link, routes } from '@redwoodjs/router';
import {FaFolderOpen} from 'react-icons/fa';
import {DiGitBranch} from 'react-icons/di';
import {AiFillSetting} from 'react-icons/ai';
import './DatacrateNavigation.css'

const DatacrateNavigation = (datacrate_uuid) => {
  return (
    <div className="component">
      <h2>{'DatacrateNavigation'}</h2>
      <p>
        {
          'Find me in ./web/src/components/DatacrateNavigation/DatacrateNavigation.js'
        }
      </p>
      <div className='row_navigation'>
        <Link to={routes.specificDatacrateContent({ datacrate_id: String(datacrate_uuid)})}>
          <div className='navigation_button'><FaFolderOpen></FaFolderOpen></div>
        </Link>
        <Link to={routes.specificDatacrateGit({ datacrate_id: String(datacrate_uuid)})}>
          <div className='navigation_button'><DiGitBranch></DiGitBranch></div>
        </Link>
        <Link to={routes.specificDatacrateSettings({ datacrate_id: String(datacrate_uuid)})}>
          <div className='navigation_button'><AiFillSetting></AiFillSetting></div>
        </Link>
      </div>
    </div>
  )
}

export default DatacrateNavigation
