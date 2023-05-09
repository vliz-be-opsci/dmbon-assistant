import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { useRef, useState, useEffect } from 'react'
import { getSpace } from 'src/utils/AxiosRequestsHandlers'
import AxiosError from 'src/components/AxiosError'
import { isURL } from 'src/utils/HelperFunctions'

const SpecificSpacePage = ({ space_id }) => {

  const [space, setSpace] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    getSpace(space_id)
      .then((response) => {
        setSpace(response.data)
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
        <MetaTags title="SpecificSpace" description="SpecificSpace page" />

        <h1>SpecificSpacePage</h1>
        <table className='table_vliz'>
          <tbody>
            {Object.keys(space).map((key) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{isURL(space[key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )
  }
}

export default SpecificSpacePage
