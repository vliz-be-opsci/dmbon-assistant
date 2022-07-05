import { useState, useEffect } from 'react'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

//import getProfile from 'src/utils/AxiosRequestsHandlers'
import { getAllProfiles } from 'src/utils/AxiosRequestsHandlers'

const OverviewProfilesPage = () => {
  const [profiles, setProfiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAllProfiles()
      .then((response) => {
        setProfiles(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  //render here
  if (isLoading) {
    return <div>Loading...</div>
  } else {
    return (
      <div>
        <MetaTags>
          <title>Overview Profiles</title>
        </MetaTags>
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
              <tr key={profile.id}>
                <td>{profile.name}</td>
                <td>{profile.parent_space}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default OverviewProfilesPage
