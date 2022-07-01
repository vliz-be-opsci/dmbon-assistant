//this file contains all the util functions that are used for handling URL params

//function to check if the user is in the datacrates url space
export const isDatacratesURL = () => {
    const url = window.location.pathname;
    if (url.includes("datacrates")) {
      return true;
    } else {
      return false;
    }
}

//function to check if user is in the profiles url space
export const isProfilesURL = () => {
    const url = window.location.pathname;
    if (url.includes("profiles")) {
      return true;
    } else {
      return false;
    }
}

//function to check if the user is in the spaces url space
export const isSpacesURL = () => {
    const url = window.location.pathname;
    if (url.includes("spaces")) {
      return true;
    } else {
      return false;
    }
}

//function to check if the user is in the homepage
export const isHomepage = () => {
    const url = window.location.pathname;
    if (url === "/") {
      return true;
    } else {
      return false;
    }
}
