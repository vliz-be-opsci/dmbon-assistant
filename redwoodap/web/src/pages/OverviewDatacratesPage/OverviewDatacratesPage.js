import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { api_url , getAllSpaces} from 'src/utils/AxiosRequestsHandlers'
import useStore from 'src/store'
import axios from 'axios'
import React, { useRef, useEffect } from 'react'
import Taskbox from 'src/components/Taskbox/Taskbox'

const OverviewDatacratesPage = () => {

  //const for spaces from the store
  const all_spaces = useStore((state) => state.spaces)
  const SettingSpaces = useStore((state) => state.setSpaces)

  const setSpacess = async() => {
    axios.get(`${api_url}/spaces`)
    .then(res => {
      console.log(res.data)
      SettingSpaces(res.data)
    }
    , (error) => {
      console.log(error);
    }
    );
  }

  useEffect(() => { 
    setSpacess();
  }
  , [])

  return (
    <>
      <MetaTags
        title="OverviewDatacrates"
        description="OverviewDatacrates page"
      />

      <h1>OverviewDatacratesPage</h1>
      <p>
        Find me in{' '}
        <code>
          ./web/src/pages/OverviewDatacratesPage/OverviewDatacratesPage.js
        </code>
      </p>
      <p>
        My default route is named <code>overviewDatacrates</code>, link to me
        with `<Link to={routes.overviewDatacrates()}>OverviewDatacrates</Link>`
      </p>
      {all_spaces.map(space => (
        <>
          <Taskbox type="running" name={space.name} description={space.storage_path} />
        </>
      ))}
    </>
  )
}

export default OverviewDatacratesPage
