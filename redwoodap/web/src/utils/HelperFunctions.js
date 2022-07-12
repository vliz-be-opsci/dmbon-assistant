//3th party imports here
// this file is for writing helper functions that will be used in other files in the frontend

// function to check if value given is a url => if yes return the value in a <a> tag els return the value
export const isURL = (value) => {
  console.log(value)
  // if value is a list then check each value in the list and return the value in a <a> tag
  if (Array.isArray(value)) {
    return value.map((url) => {
      //if value is null then pass
      if (url === null) {
        return null
      }
      if (url.includes('http') || url.includes('https')) {
        return <a href={url} target="_blank">{url}</a>
      }else{
        return url
      }
    })
  }

  // if value is null return null
  if (value === null) {
    return value
  }

  if (value.includes('http') || value.includes('https')) {
      return (<a href={value} target="_blank">{value}</a>)
  }
  return value
}

//function that will extract the last part of a given path and return it
export const getLastPath = (path) => {
  if (path === null || path === undefined) {
    return null
  }
  const splitPath = path.split('/')
  const lastpart =  splitPath[splitPath.length - 1]
  const splittedWindowspath = lastpart.split('\\')
  const lastpartWindows = splittedWindowspath[splittedWindowspath.length - 1]
  return lastpartWindows
}
