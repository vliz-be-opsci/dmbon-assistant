import { useState, useEffect } from 'react'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
//import getProfile from 'src/utils/AxiosRequestsHandlers'
import { getAllProfiles } from 'src/utils/AxiosRequestsHandlers'
import { isURL } from 'src/utils/HelperFunctions'
import { getAllSpaces } from "src/utils/AxiosRequestsHandlers"
import LoadingBlock from "src/components/LoadingBlock/LoadingBlock";
import 'src/components/component.css';
const OverviewProfilesPage = () => {
  const [profiles, setProfiles] = useState([])
  const [spaces, setSpaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  //child function that will get url from spacename

  //function that will return a a href of the url of the space
  const getSpaceURL = (space_name) => {
    for (let i = 0; i < spaces.length; i++) {
      if (spaces[i].name === space_name) {
        const space_uuid = spaces[i].uuid
        return(
          <Link to={routes.specificSpace({ space_id: String(space_uuid) })}>
            {space_name}
          </Link>
        )
      }
    }
    return space_name
  }


  useEffect(() => {
    getAllSpaces().then((response) => {
      setSpaces(response.data)
      },
      (error) => {
        console.log(error)
        setErrorMessage(error.response);
        setIsLoading(false);
        setError(true);
      }
    )
    getAllProfiles()
      .then((response) => {
        setProfiles(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response);
        setIsLoading(false);
        setError(true);
      })
  }, [])

  //render here
  if (isLoading) {
    return(LoadingBlock("Loading Profiles..."))
  }
  if(error){
    return(AxiosError(errorMessage))
  }
   else {
    return (
      <div>
        <MetaTags>
          <title>Overview Profiles</title>
        </MetaTags>
        <div className='component'>
          <h1>Overview Profiles</h1>
          <table className="table_vliz">
            <thead>
              <tr>
                <th>Name</th>
                <th>Parent Space</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.uuid}>
                  <td>
                    <Link to={routes.specificProfile({ profile_id: String(profile.uuid) })}>
                      {profile.name}
                    </Link>
                  </td>
                  <td>{getSpaceURL(profile.parent_space)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default OverviewProfilesPage
