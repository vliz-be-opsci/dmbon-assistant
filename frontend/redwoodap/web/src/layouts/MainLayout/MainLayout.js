import Navbar from "src/components/Navbar/Navbar"
import "./MainLayout.css"
const MainLayout = ({ children }) => {
  return (
  <>
    <div className="main container">
      <div className="childcontainer"><Navbar /></div>
      <div className="childcontainer">
        {children}
        </div>
    </div>
  </>)
}

export default MainLayout
