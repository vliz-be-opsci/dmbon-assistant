import { Link, routes } from '@redwoodjs/router'
import { useState } from 'react';
import { MetaTags } from '@redwoodjs/web'
import $ from 'jquery'
import Draggable, {DraggableCore} from 'react-draggable';
import "./MakeProfilePage.css"


const MakeProfilePage = () => {
  const [DragElements, setDragElements] = useState({});
  const [count, setcount] = useState(0);
  const [LastCoordinates, setLastCoordinates] = useState({});

  function addDraggableComponent() {
    console.log("event triggered");
    let currentdrag = DragElements;
    currentdrag[count] = {"text":"sampletext_"+count}
    setcount(count+1)
    setDragElements(currentdrag)
  }

  function checklocation(key,e) {
    console.log(key)
    console.log(e)
    console.log(LastCoordinates)
    //get the current outher box coordinates of the canvas_profile
    const canvas = document.getElementById("canvas_profile")
    const rect = canvas.getBoundingClientRect();
    const current_dragelement = document.getElementById("dragelement_"+key)
    console.log(rect);

    //check if the e[clientX] is bigger then rect[left] && < right - e[offsetX] and if e[clientY] is bigger then rect[top] && < rect[bottom] - e[offsetY]
    //first x values 
    if(e["clientX"] < (rect["left"]+ (e["offsetX"])) || e["clientX"] > (rect["right"] - e["offsetX"])){console.log("x value not good")}
    if(e["clientY"] < (rect["top"]+ (e["offsetY"])) || e["clientY"] > (rect["bottom"] - e["offsetY"])){console.log("y value not good")}
  }

  return (
    <>
      <MetaTags title="MakeProfile" description="MakeProfile page" />

      <h1>MakeProfilePage</h1>

      <p>
        Find me in
        <code>./web/src/pages/MakeProfilePage/MakeProfilePage.js</code>
      </p>

      <p>
        My default route is named 
        <code> makeProfile</code>, link to me with `
        <Link to={routes.makeProfile()}>MakeProfile</Link>`
      </p>
      <p>
        <b>For now this will be a playground for dragging components</b>
      </p>
      <div className='workspace_draggable_edits'>
        <div className='sidebar'>
          <button className='dragbutton' onClick={addDraggableComponent}>add draggable component</button>
        </div>
        <div className='canvas_profile' id='canvas_profile'>
          {Object.keys(DragElements).map((key) => {
            return (
              <Draggable bounds="parent" onStop={e => checklocation(key,e)} key={key}><div id={"dragelement_"+key} className='dragelement'>{DragElements[key]["text"]}</div></Draggable>
            );
          }
          )}
        </div>
      </div>
    </>
  )
}

export default MakeProfilePage
