import "./AxiosError.css"

const AxiosError = (error) => {
  console.log(error.errorMessage);
  //try and get the following data from the error object : message, name , code
  //if it is not there, then return the error object as a string
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
    try {
      let errorData = {"message": error.errorMessage.message, "name":error.errorMessage.name, "code": error.errorMessage.code}
      return (
        <div className="component">
          <div className="Axios_error">
            <h1>{errorData.name} : {errorData.message}</h1>
            <h2>message: {errorData.message}</h2>
            <h2>code : {errorData.code}</h2>
            <hr></hr>
            <a href="/"><b>return to homepage</b></a>
            <br></br>
            <a href="."><b>reload page</b></a>
          </div>
        </div>
      )
    } catch (error) {
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
}

export default AxiosError
