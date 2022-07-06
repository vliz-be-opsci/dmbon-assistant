import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { useState, useEffect } from 'react'
import { getAllSpaces } from 'src/utils/AxiosRequestsHandlers'
import AxiosError from 'src/components/AxiosError/AxiosError'
import { string } from 'prop-types'
const OverviewSpacesPage = () => {

  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    getAllSpaces()
      .then(response => {
        setSpaces(response.data)
        setLoading(false)
        console.log(response.data)
      }
      )
      .catch(error => {
        setErrorMessage(error.response)
        setError(error)
        setLoading(false)
      }
      )
  }, [])


  if(loading) {
    return <div>Loading...</div>
  }
  if(error){
    return (AxiosError(errorMessage))
  }
  else{
    return (
      <>
        <MetaTags title="OverviewSpaces" description="OverviewSpaces page" />

        <h1>OverviewSpacesPage</h1>
        <table className='table_vliz'>
          <thead>
            <tr>
              <th>name</th>
              <th>uuid</th>
            </tr>
          </thead>
          <tbody>
            {spaces.map((space) => (
              <tr key={space.uuid}>
                <td>
                  <Link to={routes.specificSpace({ space_id: String(space.uuid) })}>
                    {space.name}
                  </Link>
                </td>
                <td>{space.uuid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )
  }
}

export default OverviewSpacesPage
