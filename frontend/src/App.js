import './App.css';
import {Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import SpacePage from './pages/spaces';
import SpaceSpecificPage from './pages/specific_space';
import FileSpecificPage from './pages/specific_file';
import Navbar from './components/navbar_general';
import SpaceOverviewPage from './pages/space_overview';
import HierarchicalSpacePage from './pages/hierarchical_space_storage';
import GitPage from './pages/git';
import SettingsSpacePage from './pages/settings_space';
import HomePage from './pages/home_page';
import Footer from './components/footer';
require('dotenv').config()
var port_server = process.env.REACT_APP_PORT_BACKEND_SERVER;
const BASE_URL_SERVER = 'http://'+window.location.hostname+':'+port_server+'/';
function App() {
  return (
    <div className="App">
      <Navbar/>
      <div className="container">
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/spaces' element={<SpacePage/>} />
          <Route path='/spaces/:SpaceId/all_files' element={<SpaceSpecificPage/>} />
          <Route path='/spaces/:SpaceId/files/*' element={<HierarchicalSpacePage/>} />
          <Route path='/spaces/:SpaceId' element={<SpaceOverviewPage/>} />
          <Route path='/spaces/:SpaceId/git' element={<GitPage/>} />
          <Route path='/spaces/:SpaceId/settings' element={<SettingsSpacePage/>} />
          <Route path='/spaces/:SpaceId/all_files/:FileId' element={<FileSpecificPage/>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
export {BASE_URL_SERVER};
