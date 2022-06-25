import './App.css';
import {Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import DatacratePage from './pages/Datacrate';
import SpacesPage from './pages/spaces';
import ProfilesPage from './pages/Profiles';
import SpecificSpace from './pages/specific_space';
import SpecificProfile from './pages/Specific_Profile';
import DatacrateSpecificPage from './pages/specific_Datacrate';
import FileSpecificPage from './pages/specific_file';
import Navbar from './components/navbar_general';
import DatacrateOverviewPage from './pages/Datacrate_overview';
import HierarchicalDatacratePage from './pages/hierarchical_Datacrate_storage';
import GitPage from './pages/git';
import SettingsDatacratePage from './pages/settings_Datacrate';
import NotFoundPage from './pages/404';
import HomePage from './pages/home_page';
require('dotenv').config()
var port_server = process.env.REACT_APP_PORT_BACKEND_SERVER;
const BASE_URL_SERVER = 'http://'+window.location.hostname+':'+port_server+'/';
const NEW_USER = process.env.REACT_APP_NEW_USER;
//App.use(express.static('public'));
function App() {
  return (
    <>
    <div className="App">
      <Navbar/>
      <div className="container">
        <Routes>
          <Route path="*" element={NotFoundPage} />
          <Route path='/' element={<HomePage/>} />
          <Route path='/Datacrates' element={<DatacratePage/>} />
          <Route path='/Profiles' element={<ProfilesPage/>} />
          <Route path='/Profiles/:ProfileId' element={<SpecificProfile/>} />
          <Route path='/Spaces' element={<SpacesPage/>} />
          <Route path='/Spaces/:SpaceId' element={<SpecificSpace/>} />
          <Route path='/Datacrates/:SpaceId/all_files' element={<DatacrateSpecificPage/>} />
          <Route path='/Datacrates/:SpaceId/files/*' element={<HierarchicalDatacratePage/>} />
          <Route path='/Datacrates/:SpaceId' element={<DatacrateOverviewPage/>} />
          <Route path='/Datacrates/:SpaceId/git' element={<GitPage/>} />
          <Route path='/Datacrates/:SpaceId/settings' element={<SettingsDatacratePage/>} />
          <Route path='/Datacrates/:SpaceId/all_files/:FileId' element={<FileSpecificPage/>} />
        </Routes>
      </div>
    </div>
    </>
    
  );
}

export default App;
export {BASE_URL_SERVER};
export {NEW_USER};
