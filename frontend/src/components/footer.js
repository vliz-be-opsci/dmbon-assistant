import 'bootstrap/dist/css/bootstrap.min.css'
// import '.././css/index.css'

var style = {
    backgroundColor: "#F8F8F8",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "20px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "60px",
    width: "100%",
}

var phantom = {
  display: 'block',
  padding: '20px',
  height: '60px',
  width: '100%',
}


function Footer() {

    return (
        <div>
            <div style={phantom} />
            <div style={style}>
                Footer here with info about the app and vliz
            </div>
        </div>
    )
}

export default Footer