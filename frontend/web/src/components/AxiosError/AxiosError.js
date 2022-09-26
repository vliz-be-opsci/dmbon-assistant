import "./AxiosError.css"

const AxiosError = (error) => {
  console.log(error)
  try {
    return (
      <div className="component">
        <div className="Axios_error">
          <h1>{error.status} : {error.statusText}</h1>
          <h2>url request method : {error.config.method}</h2>
          <p><i>{error.config.url}</i></p>
          <p>{error.data.detail}</p>
          <hr></hr>
          <a href="/"><b>return to homepage</b></a>
          <br></br>
          <a href="."><b>reload page</b></a>
        </div>
      </div>
      
    )
  } catch (err) {

    return (
      <div className="component">
        <div className="Axios_error">
          <h2>UI error</h2>
          <p>{err.errorMessage}</p>
          <hr></hr>
          <a href="/"><b>return to homepage</b></a>
          <br></br>
          <a href="."><b>reload page</b></a>
        </div>
      </div>
      
    )
  }

}

export default AxiosError
