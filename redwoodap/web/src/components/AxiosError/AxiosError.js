import "./AxiosError.css"

const AxiosError = (error) => {
  console.log(error)
  return (
    <div className="Axios_error">
      <h1>{error.status} : {error.statusText}</h1>
      <h2>url request method : {error.config.method}</h2>
      <p><i>{error.config.url}</i></p>
      <p>{error.data.detail}</p>
      <hr></hr>
      <a href="/"><b>return to homepage</b></a>
    </div>
  )
}

export default AxiosError
