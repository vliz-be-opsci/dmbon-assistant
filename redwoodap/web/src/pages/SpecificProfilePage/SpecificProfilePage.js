import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { useRef, useState, useEffect } from 'react'
import { getProfile } from 'src/utils/AxiosRequestsHandlers'
import { isURL } from 'src/utils/HelperFunctions'
import AxiosError from 'src/components/AxiosError'
import { getAllSpaces } from "src/utils/AxiosRequestsHandlers"

const SpecificProfilePage = ({ profile_id }) => {

  const [profile, setProfile] = useState({})
  const [spaces, setSpaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')



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

  //function that maps the spaces to a href of the url of the space
  const Tablerow = (props) => {
    console.log(props)
    const key = props.keyo;
    if (key == "parent_space") {
      return (
        <>
          <td>{key}</td>
          <td>{profile[key] === null ? null : getSpaceURL(profile[key])}</td>
        </>
      )
    }else{
      return(
        <>
        <td>{key}</td>
        <td>{isURL(profile[key])}</td>
        </>
      )
    }
  }


  useEffect(() => {
    getProfile(profile_id)
      .then((response) => {
        setProfile(response.data)
        setIsLoading(false)
      }
      )
      .catch((error) => {
        console.log(error)
        setErrorMessage(error.response)
        setIsLoading(false)
        setError(true)
      }
      )
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
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return(AxiosError(errorMessage))
  }
  else{
    return (
      <>
        <MetaTags title="SpecificProfile" description="SpecificProfile page" />

        <h1>SpecificProfilePage</h1>

        <table className='table_vliz'>
          <tbody>
            {Object.keys(profile).map((key) => (
              <tr key={key}>
                <Tablerow keyo = {key} />
              </tr>
            ))}
          </tbody>
        </table>

      </>
    )
  }
}

export default SpecificProfilePage
