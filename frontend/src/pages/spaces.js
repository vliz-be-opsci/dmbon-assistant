import React, {useState, useEffect, useRef} from 'react';
import ReactLoading from 'react-loading';
function SpacesPage() {

//define all constants first

  const [Loading, setLoading] = useState(false); 
 
  if(Loading){
      return(
        <div class="busy">
            <ReactLoading type='bars' color='#006582' height={'20vw'} width={'20vw'} />
        </div>
      )
      }else{
        return (
          <>
            <p>Spaces overview here</p>
          </>
      )
    }
    
}

export default SpacesPage