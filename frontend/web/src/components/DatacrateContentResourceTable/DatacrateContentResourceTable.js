import { useState, useEffect} from "react";
import { getAllAnnotations, getAnnotationsFile, postAnnotationFile, deleteAnnotationFile, postNodeFile} from "src/utils/AxiosRequestsHandlers";
import AxiosError from "../AxiosError/AxiosError";
import {Modal} from "react-bootstrap";

import LoadingBlock from "../LoadingBlock/LoadingBlock";
import DatacrateContentResourceRow from "../DatacrateContentResourceRow/DatacrateContentResourceRow";
import AnnotationTable from "../AnnotationTable/AnnotationTable";
import AnnotationValidationErrorOverview from "../AnnotationValidationErrorOverview/AnnotationValidationErrorOverview";
import ProgressBarContent from '../ProgressBar/ProgressBar';

const DatacrateContentResourceTable = (datacrate_uuid) => {

  const [DatacrateContent, setDatacrateContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showmodal, setShowmodal] = useState(false);
  const [showAnnotationErrors, setShowAnnotationErrors] = useState(true);
  const [modalContent, setModalContent] = useState({});
  const [specificFileContent, setSpecificFileContent] = useState([{}]);
  const [PredicateAnnotation, setPredicateAnnotation] = useState("");
  const [ValueAnnotation, setValueAnnotation] = useState("");
  const [AddingAnnotation, setAddingAnnotation] = useState(false);
  const [DeletingAnnotation, setDeletingAnnotation] = useState(false);
  const [allResourceNodes,setAllResourceNodes] = useState([]);
   //filerow specific states
   const [checkboxSelectedFiles, setCheckboxSelectedFiles] = useState([]);
   const [normalselectedfiles, setNormalselectedfiles] = useState([]);



  //useEffect that gets triggered by a change in DeleteAnnotation, if deleteAnnotationFile is false then it will get annotations for the file and set the state of DatacrateContent to the annotations
  useEffect(() => {
    if(!DeletingAnnotation){
      if(modalContent.file_name){
        //console.log(modalContent.file_name);
        getAnnotationsFile(datacrate_uuid, encodeURIComponent(modalContent.file_name)).then(res => {
          //console.log(res.data);
          let checked_data = checkAnnotationValues(res.data);
          setSpecificFileContent(checked_data);
          // set the DatarcateContent.file.summary to res.data.summary
          let file_name = modalContent.file_name;
          //loop through keys of DatacrateContent and if the key is file_name then set the summary to the summary of the file
          for(let key in DatacrateContent){
            if(key === file_name){
              DatacrateContent[key]["summary"] = res.data.summary;
            }
          }

        }).catch(err => {
          console.log(err);
          setError(true);
          setErrorMessage(err);
        }
        );
      }
    }
  }, [DeletingAnnotation]);

  //function that will check if all the values in a resp are predicate , value and if the key value is a str or int and if something else then it will convert it into str
  const checkAnnotationValues = (resp) => {
    for(let item in resp){
      if(item == "data"){
        for(let i = 0; i < resp[item].length; i++){
          let predicate = resp[item][i].predicate;
          let value = resp[item][i].value;
          if(typeof value !== "string"){
            resp[item][i].value = value.toString();
          }
        }
      }
    }
    console.warn("resp coming");
    console.log(resp);
    return resp;
  }


  //useffect that gets triggered by a change in AddingAnnotation, if adding annotation is false it will get annotations for file and set the state to the annotations
  useEffect(() => {
    if(!AddingAnnotation){
      if(modalContent.file_name){
        //console.log(modalContent.file_name);
        getAnnotationsFile(datacrate_uuid, encodeURIComponent(modalContent.file_name)).then(res => {
          //console.log(res.data);
          let checked_data = checkAnnotationValues(res.data);
          setSpecificFileContent(checked_data);
          let file_name = modalContent.file_name;
          for(let key in DatacrateContent){
            if(key === file_name){
              DatacrateContent[key]["summary"] = res.data.summary;
            }
          }
        }).catch(err => {
          console.log(err);
          setError(true);
          setErrorMessage(err);
        }
        );
      }
    }
  } , [AddingAnnotation]);

  useEffect(() => {

    getAllAnnotations(datacrate_uuid).then(res => {
      //for entry in res.data.data, if the key contains http or https then console.log
      let contentdata = {};
      let allResourceNodess = [];
      for(let entry in res.data.data){
        if(entry.includes("http") || entry.includes("https") || !entry.startsWith("./")){
          contentdata[entry] = res.data.data[entry];
          allResourceNodess.push(res.data.data[entry]);
        }else{
          //add the key and value to the contentdata object
          console.log(entry);
        }
      }
      console.log(allResourceNodess);
      setDatacrateContent(contentdata);
      setAllResourceNodes(allResourceNodess);
      //console.log(res.data.data);
      setLoading(false);
    }
    ).catch(err => {
      console.log(err);
      setError(true);
      setErrorMessage(err);
      setLoading(false);
    }
    );
  }, [datacrate_uuid]);

  //useeffect that triggers when modalcontent is updated that will fetch the specific file content
  useEffect(() => {
    if(modalContent.file_name){
      //console.log(modalContent.file_name);
      getAnnotationsFile(datacrate_uuid, encodeURIComponent(modalContent.file_name)).then(res => {
        console.log(res.data);
        let checked_data = checkAnnotationValues(res.data);
        setSpecificFileContent(checked_data);
      }).catch(err => {
        //console.log(err);
        setError(true);
        setErrorMessage(err);
      }
      );
    }
  }
  , [modalContent]);

  //function that returns the modal
  const MakeModal = () => {
    //check if modalContent contains the keys "info" and "file_name"
    if(modalContent.hasOwnProperty("info") && modalContent.hasOwnProperty("file_name")){
      //check if the length of oject.keys(specificFileContent) is  > 0
      //console.log(specificFileContent);
      //console.log(Object.keys(specificFileContent));
      if(Object.keys(specificFileContent).length > 0){
        return(
          <Modal show={showmodal} fullscreen={true} onHide={() => setShowmodal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>
                {modalContent.file_name}
                <ProgressBarContent content={specificFileContent.summary} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
              AnnotationValidationErrorOverview(
                 specificFileContent.shacl_requirements,
                 showAnnotationErrors,
                 setShowAnnotationErrors,
                 specificFileContent.data,
                 datacrate_uuid,
                 modalContent.file_name,
                 postAnnotationFile,
                 setAddingAnnotation,
                 postNodeFile,
                 allResourceNodes
                )
              }
              <br></br>
              {
              AnnotationTable(
                 specificFileContent.data,
                 PredicateAnnotation,
                 setPredicateAnnotation,
                 ValueAnnotation,
                 setValueAnnotation,
                 postAnnotationFile,
                 deleteAnnotationFile,
                 datacrate_uuid,
                 modalContent.file_name,
                 setAddingAnnotation,
                 setDeletingAnnotation,
                )
              }
              <br></br>

            </Modal.Body>
          </Modal>
          )
      }else{
        return(
          <Modal show={showmodal} fullscreen={true} onHide={() => setShowmodal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{modalContent.file_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {LoadingBlock("Loading specific file content...")}
            </Modal.Body>
          </Modal>
        )
      }
    }else{
      return(<></>)
    }
  }
  //DatacrateContentFileRow(file, file.file, datacrate_uuid)

  //return renders
  if (loading) {
    return LoadingBlock("Fetching Datacrate Resources, this can take a while");
  }
  if (error) {
    return <AxiosError errorMessage={errorMessage} />;
  }
  else{
    return (
      <>
      <div className="component">
        <div className="title">Resources</div>
        {Object.keys(DatacrateContent).map((key) => {
          return DatacrateContentResourceRow(key,datacrate_uuid,DatacrateContent[key],setShowmodal, setModalContent, setSpecificFileContent, checkboxSelectedFiles, setCheckboxSelectedFiles,normalselectedfiles, setNormalselectedfiles);
        }
        )}
      </div>
      {MakeModal()}
      </>
    )
  }
}

export default DatacrateContentResourceTable
