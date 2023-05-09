import react , {useEffect, useState} from 'react';
import { Link, routes } from '@redwoodjs/router';
import {FaFolderOpen} from 'react-icons/fa';
import {DiGitBranch} from 'react-icons/di';
import {AiFillSetting} from 'react-icons/ai';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';
import { getDatacrate } from 'src/utils/AxiosRequestsHandlers';
import { getLastPath } from 'src/utils/HelperFunctions';
import './DatacrateNavigation.css'

const DatacrateNavigation = (datacrate_uuid) => {

  const [Datacrate, setDatacrate] = useState({});

  useEffect(() => {
    getDatacrate(datacrate_uuid).then(res => {
      setDatacrate(res.data);
    }
    ).catch(err => {
      console.log(err);
    }
    );
  }, [datacrate_uuid]);

  return (
    <div className="component">
      <div className='row_navigation'>
        <Link className='navigation_button' to={routes.specificDatacrate({ datacrate_id: String(datacrate_uuid)})}>
          <div>{getLastPath(Datacrate.storage_path)|| <Skeleton />}</div>
        </Link>
        <Link className='navigation_button' to={routes.specificDatacrateContent({ datacrate_id: String(datacrate_uuid)})}>
          <div><FaFolderOpen></FaFolderOpen></div>
        </Link>
        <Link className='navigation_button' to={routes.specificDatacrateGit({ datacrate_id: String(datacrate_uuid)})}>
          <div ><DiGitBranch></DiGitBranch></div>
        </Link>
        <Link className='navigation_button' to={routes.specificDatacrateSettings({ datacrate_id: String(datacrate_uuid)})}>
          <div ><AiFillSetting></AiFillSetting></div>
        </Link>
      </div>
    </div>
  )
}

export default DatacrateNavigation
