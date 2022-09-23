import { Link, routes } from '@redwoodjs/router'
import { useState , useEffect} from 'react';
import { MetaTags } from '@redwoodjs/web'
import $ from 'jquery'
import Draggable, {DraggableCore} from 'react-draggable';
import "./MakeProfilePage.css"


const MakeProfilePage = () => {
  const [DragElements, setDragElements] = useState({});
  const [count, setcount] = useState(0);

  function addDraggableComponent() {
    console.log("event triggered");
    let currentdrag = DragElements;
    currentdrag[count] = {"text":"sampletext_"+count}
    setcount(count+1)
    setDragElements(currentdrag)
  }

  function deletedragComponent(id) {
    console.log("deleting key", id);
    let currentdrag = DragElements;
    delete currentdrag[id]
    console.log("currentdrag", currentdrag);
    setDragElements(currentdrag);
    setcount(count-1)
  }

  //everytime the count changes, this function is called
  useEffect(() => {
    console.log("count changed", count);
    console.log("DragElements", DragElements);
  }, [DragElements,count])


  function checklocation(key,e) {
    console.log(key)
    console.log(e)
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
              <Draggable bounds="parent" onStop={e => checklocation(key,e)} key={key}>
              <div id={"dragelement_"+key} className='dragelement'>
                {DragElements[key]["text"]}
                <button className='deletebutton' onClick={() => deletedragComponent(key)}>delete</button>
                </div>
              </Draggable>
            );
          }
          )}
        </div>
      </div>
    </>
  )
}

export default MakeProfilePage
