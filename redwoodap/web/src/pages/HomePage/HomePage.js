import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import useStore from 'src/store'
import Taskbox from 'src/components/Taskbox/Taskbox'
import { useRef } from 'react'

const HomePage = () => {
  /*
  const inputref = useRef()
  const addingSpace = useStore((state) => state.addSpace)
  const add = () => {
    const value = inputref.current.value
    console.log(value)
    if (value) {
      addingSpace(value)
    }
  }

  <input type="text" ref={inputref}></input>
  <button onClick={add}>Add Space</button>
  {all_spaces.map(space => (
    <Taskbox type="running" name={space} description={space + " description"} />
  ))}
  const all_spaces = useStore((state) => state.spaces)
  */

  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <main>
        <h1>Home</h1>

      </main>
    </>
  )
}

export default HomePage