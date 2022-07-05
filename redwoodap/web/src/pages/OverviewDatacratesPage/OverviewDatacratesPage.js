import React, { useRef, useState, useEffect } from 'react'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import Taskbox from 'src/components/Taskbox/Taskbox'
import { getAllDatacrates } from 'src/utils/AxiosRequestsHandlers'

const OverviewDatacratesPage = () => {
  //const for spaces from the store
  const [loading, setLoading] = useState(true)
  const [all_spaces, setSpaces] = useState([]);

  useEffect(() => {
    getAllDatacrates()
      .then(res => {
        setSpaces(res.data)
        setLoading(false)
      }
      )
      .catch(err => {
        console.log(err)
      }
      )
  }, [])


  //render
  if(loading) {
    return <div>Loading...</div>
  }
  else{
    return (
      <>
        <MetaTags
          title="OverviewDatacrates"
          description="OverviewDatacrates page"
        />
        <h1>OverviewDatacratesPage</h1>
        {all_spaces.map((space) => (
          <>
            <Taskbox
              type="running"
              name={space.name}
              description={space.storage_path}
            />
          </>
        ))}
      </>
    )
  }

}

export default OverviewDatacratesPage
