import React, { useRef, useState, useEffect } from 'react'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import AxiosError from 'src/components/AxiosError/AxiosError'
import { getAllDatacrates } from 'src/utils/AxiosRequestsHandlers'
import process from 'process';
import { getAllProfiles } from 'src/utils/AxiosRequestsHandlers';
import LoadingBlock from "src/components/LoadingBlock/LoadingBlock";
import 'src/components/component.css';

const OverviewDatacratesPage = () => {
  //const for spaces from the store
  const [loading, setLoading] = useState(true)
  const [all_spaces, setSpaces] = useState([]);
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [all_profiles, setProfiles] = useState([])



  const getProfileName = (profile_uuid) => {
    for (let i = 0; i < all_profiles.length; i++) {
      if (all_profiles[i].uuid === profile_uuid) {
        return (
          <Link to={routes.specificProfile({ profile_id: String(profile_uuid) })}>
            {all_profiles[i].name}
          </Link>
        )
      }
    }
    return profile_uuid
  }

  useEffect(() => {
    getAllProfiles().then((response) => {
      setProfiles(response.data)
      },
      (error) => {
        console.log(error)
        setErrorMessage(error.response);
        setLoading(false);
        setError(true);
      }
    )
    getAllDatacrates()
      .then(res => {
        setSpaces(res.data);
        setLoading(false);
      }
      )
      .catch(err => {
        console.log(err);
        setErrorMessage(err.response);
        setLoading(false);
        setError(true);
      }
      )
  }, [])

  const datacrate_name = (datacrate_storage_path) => {
    //split datacrate_storage_path and make last part of the array into a const
    //get seperator of os
    const seperator = (process.platform === 'win32') ? '\\' : '/';

    let datacrate_name = datacrate_storage_path.split(seperator);
    //get last part of the array
    const last_part = datacrate_name[datacrate_name.length - 1];
    //split again by /
    datacrate_name = last_part.split('\\');
    //get last part of the array
    datacrate_name = datacrate_name[datacrate_name.length - 1];
    return datacrate_name;
  }

  //render
  if(loading) {
    return(LoadingBlock("Loading Datacrates..."))
  }
  if (error) {
    return(AxiosError(errorMessage))
  }
  else{
    return (
      <>
        <MetaTags
          title="OverviewDatacrates"
          description="OverviewDatacrates page"
        />
        <div className='component'>
        <h1>OverviewDatacratesPage</h1>
        <table className="table_vliz">
          <thead>
            <tr>
              <th>Name</th>
              <th>Profile used</th>
            </tr>
          </thead>
          <tbody>
            {all_spaces.map((space) => (
              <tr key={space.name}>
                <td>
                  <Link to={routes.specificDatacrate({ datacrate_id: String(space.name) })}>
                    {datacrate_name(space.storage_path)}
                  </Link>
                </td>
                <td>{getProfileName(space.RO_profile)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

      </>
    )
  }
}

export default OverviewDatacratesPage
