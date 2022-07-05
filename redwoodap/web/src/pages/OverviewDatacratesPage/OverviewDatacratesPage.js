import React, { useRef, useEffect } from 'react'

import axios from 'axios'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import Taskbox from 'src/components/Taskbox/Taskbox'
import useStore from 'src/store'
import { api_url, getAllSpaces } from 'src/utils/AxiosRequestsHandlers'

const OverviewDatacratesPage = () => {
  //const for spaces from the store
  const all_spaces = useStore((state) => state.spaces)
  const SettingSpaces = useStore((state) => state.setSpaces)

  const setSpacess = async () => {
    axios.get(`${api_url}/spaces`).then(
      (res) => {
        console.log(res.data)
        SettingSpaces(res.data)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  useEffect(() => {
    setSpacess()
  }, [])

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

export default OverviewDatacratesPage
