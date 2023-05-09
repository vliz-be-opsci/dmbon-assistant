import AxiosError from './AxiosError'

const errorobject = {
  "data": {
      "detail": "profile not found"
  },
  "status": 404,
  "statusText": "Not Found",
  "headers": {
      "content-length": "30",
      "content-type": "application/json"
  },
  "config": {
      "transitional": {
          "silentJSONParsing": true,
          "forcedJSONParsing": true,
          "clarifyTimeoutError": false
      },
      "transformRequest": [
          null
      ],
      "transformResponse": [
          null
      ],
      "timeout": 0,
      "xsrfCookieName": "XSRF-TOKEN",
      "xsrfHeaderName": "X-XSRF-TOKEN",
      "maxContentLength": -1,
      "maxBodyLength": -1,
      "env": {
          "FormData": null
      },
      "headers": {
          "Accept": "application/json, text/plain, */*"
      },
      "method": "get",
      "url": "http://localhost:6656/apiv1/profiles/10ae68011cb947d58e26eeb38719204a4"
  },
  "request": {}
}

export const generated = () => {
  return (AxiosError(errorobject))
}

export default { title: 'Components/AxiosError' }
