import './App.css';
import {Route, Routes} from 'react-router-dom';
import {useNavigate, useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import SpacePage from './pages/spaces';
import SpaceSpecificPage from './pages/specific_space';
import FileSpecificPage from './pages/specific_file';
import Navbar from './components/navbar_general';
function App() {

  return (
    <div className="App">
      <Navbar/>
      <div className="container">
        <Routes>
          <Route path='/spaces' element={<SpacePage/>} />
          <Route path='/spaces/:SpaceId' element={<SpaceSpecificPage/>} />
          <Route path='/spaces/:SpaceId/:FileId' element={<FileSpecificPage/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
