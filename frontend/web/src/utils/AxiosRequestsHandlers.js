//third part lib imports:
import axios from 'axios';
import axiosRetry from 'axios-retry';

//check if this actually does anything?
axiosRetry(axios, { retries: 5 });
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });
//axiops retry ignore cors errors
axiosRetry(axios, { shouldResetTimeout: true });
axiosRetry(axios, { retryCondition: () =>  true });
const base_url = "http://localhost:6656";
export const BASE_URL_SERVER = `${base_url}/apiv1`;
//write all diff api requests here and export them

//get all profiles
export const getAllProfiles = () => {
  return axios.get(`${BASE_URL_SERVER}/profiles`);
}

//get specific profile
export const getProfile = (id) => {
  return axios.get(`${BASE_URL_SERVER}/profiles/${id}`);
}

//post new profile
export const postProfile = (profile) => {
  return axios.post(`${BASE_URL_SERVER}/profiles`, profile);
}

//update profile with id
export const updateProfile = (id, profile) => {
  return axios.put(`${BASE_URL_SERVER}/profiles/${id}`, profile);
}

//delete profile with id
export const deleteProfile = (id) => {
  return axios.delete(`${BASE_URL_SERVER}/profiles/${id}`);
}

//get all projects
export const getAllSpaces = () => {
  return axios.get(`${BASE_URL_SERVER}/projects`);
}

//get specific project
export const getSpace = (id) => {
  return axios.get(`${BASE_URL_SERVER}/projects/${id}`);
}

//post new project
export const postSpace = (space) => {
  return axios.post(`${BASE_URL_SERVER}/projects`, space);
}

//update project with id
export const updateSpace = (id, space) => {
  return axios.put(`${BASE_URL_SERVER}/projects/${id}`, space);
}

//delete project with id
export const deleteSpace = (id) => {
  return axios.delete(`${BASE_URL_SERVER}/projects/${id}`);
}

//get all datacrates
export const getAllDatacrates = () => {
  return axios.get(`${BASE_URL_SERVER}/spaces/`);
}

//get specific datacrate
export const getDatacrate = (id) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}`);
}

//post new datacrate
export const postDatacrate = (datacrate) => {
  return axios.post(`${BASE_URL_SERVER}/spaces`, datacrate);
}

//update datacrate with id
export const updateDatacrate = (id, datacrate) => {
  return axios.put(`${BASE_URL_SERVER}/spaces/${id}`, datacrate);
}

//delete datacrate with id
export const deleteDatacrate = (id) => {
  return axios.delete(`${BASE_URL_SERVER}/spaces/${id}`);
}

//fix datacrate with id
export const fixDatacrate = (id) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/fixcrate`);
}

//get git status from a specific datacrate
export const getGitStatus = (id) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/git/status/`);
}

//get git diff from a specific datacrate
export const getGitDiff = (id) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/git/diff/`);
}

//get git history from a specific datacrate
export const getGitHistory = (id) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/git/history/`);
}

//post git command to a specific datacrate
export const postGitCommand = (id, command, message) => {
  return axios.post(`${BASE_URL_SERVER}/spaces/${id}/git/${command}`,message);
}

//get content from specific datacrate
export const getContent = (id) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/content/`);
}

//post content to specific datacrate  => deprecated
export const postContent = (id, content) => {
  return axios.post(`${BASE_URL_SERVER}/spaces/${id}/content/`, content);
}

//delete content from specific datacrate => deprecated
export const deleteContent = (id,) => {
  return axios.delete(`${BASE_URL_SERVER}/spaces/${id}/content/`);
}

// get call to open file from datacrate in external window
export const getOpenFile = (id, file_id) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/content/${file_id}`);
}

// get call to open datacrate in file_exporer
export const getOpenFileExplorer = (id) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/content/openexplorer`);
}

// apost request to add reference to datacrate
export const postAddReferences = (id, reference) => {
  return axios.post(`${BASE_URL_SERVER}/spaces/${id}/content/reference`, reference);
}

// get request to get folder info of specific datacrate => deprecated
export const getFolderInfo = (id, path_folder) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/content/${path_folder}`);
}

// get all datacrate annotations for specific datacrate
export const getAllAnnotations = (id) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/annotation/`);
}

// post new annotation for all datacrates
export const postAnnotationAll = (id, annotation) => {
  return axios.post(`${BASE_URL_SERVER}/spaces/${id}/annotation/`, annotation);
}

// post new annotation for specific file in datacrate
export const postAnnotationFile = (id, file_id, annotation) => {
  return axios.post(`${BASE_URL_SERVER}/spaces/${id}/annotation/file/${file_id}`, annotation);
}

// get annotions for specific file in datacrate
export const getAnnotationsFile = (id, file_id) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/annotation/file/${file_id}`);
}

// post new blanknote for specific file in datacrate
export const postNodeFile = (id, file_id, payload) => {
  return axios.post(`${BASE_URL_SERVER}/spaces/${id}/annotation/file/node/${file_id}`, payload);
}

// delete annotation for specific file in datacrate
export const deleteAnnotationFile = (id, file_id, annotation_id) => {
  return axios.delete(`${BASE_URL_SERVER}/spaces/${id}/annotation/file/${annotation_id}/${file_id}`);
}

// delete all annotations for specific datacrate
export const deleteAnnotationAll = (id, annotation) => {
  return axios.delete(`${BASE_URL_SERVER}/spaces/${id}/annotation/`, annotation);
}

//get shacl report for specific datacrate
export const getShaclReport = (id) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/annotation/shacl_report`);
}

//get shacl terms for specific datacrate
export const getShaclTerms = (id) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/annotation/terms`);
}

export const getFolderSetup = () => {
  return axios.get(`${BASE_URL_SERVER}/tasks/foldersetup`);
}

export const getSshCheck = () => {
  return axios.get(`${BASE_URL_SERVER}/tasks/sshcheck`);
}

export const postAddUserData = (user_data) => {
  return axios.post(`${BASE_URL_SERVER}/tasks/adduserdata`, user_data);
}

export const getMakeSshKey = () => {
  return axios.get(`${BASE_URL_SERVER}/tasks/make_ssh_key`);
}

export const getConnectSshKey = () => {
  return axios.get(`${BASE_URL_SERVER}/tasks/connect_ssh_key`);
}

export const getFinishSetup = () => {
  return axios.get(`${BASE_URL_SERVER}/tasks/finishsetup`);
}

export const getCheckSetup = () => {
  return axios.get(`${BASE_URL_SERVER}/tasks/checkcompletestatus`);
}

export const getAnnotationByNodeType = (id, node_type) => {
  return axios.get(`${BASE_URL_SERVER}/spaces/${id}/annotation/type/${node_type}`);
}
