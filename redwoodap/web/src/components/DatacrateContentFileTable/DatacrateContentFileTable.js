import { useState, useEffect} from "react";
import { getAllAnnotations, getAnnotationsFile, postAnnotationFile, deleteAnnotationFile, postBlanknoteFile} from "src/utils/AxiosRequestsHandlers";
import AxiosError from "../AxiosError/AxiosError";
import {Modal} from "react-bootstrap";


import LoadingBlock from "../LoadingBlock/LoadingBlock";
import DatacrateContentFileRow from "../DatacrateContentFileRow/DatacrateContentFileRow";
import AnnotationTable from "../AnnotationTable/AnnotationTable";
import AnnotationValidationErrorOverview from "../AnnotationValidationErrorOverview/AnnotationValidationErrorOverview";
import ProgressBarContent from '../ProgressBar/ProgressBar';
import FileActions from 'src/components/FileActions/FileActions';
import 'react-loading-skeleton/dist/skeleton.css';
import '../component.css';
import './DatacrateContentFileTable.css'
//check if this actually does anything?

const DatacrateContentFileTable = (datacrate_uuid) => {

  const [DatacrateContent, setDatacrateContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showmodal, setShowmodal] = useState(false);
  const [showAnnotationErrors, setShowAnnotationErrors] = useState(true);
  const [modalContent, setModalContent] = useState({});
  const [specificFileContent, setSpecificFileContent] = useState({});
  const [PredicateAnnotation, setPredicateAnnotation] = useState("");
  const [ValueAnnotation, setValueAnnotation] = useState("");
  const [AddingAnnotation, setAddingAnnotation] = useState(false);
  const [DeletingAnnotation, setDeletingAnnotation] = useState(false);
  const [Showuploadmodal, setShowuploadmodal] = useState(false);
  const [exploreradded, setExploreradded] = useState(false);

  console.log(`predicate annotation is ${PredicateAnnotation}`);
  console.log(`dtatacratecontent is ${DatacrateContent}`);

  useEffect(() => {
    if(!exploreradded){
      setLoading(true);
      getAllAnnotations(datacrate_uuid).then(res => {
        //for entry in res.data.data, if the key contains http or https then console.log
        let contentdata = {};
        for(let entry in res.data.data){
          if(entry.includes("http") || entry.includes("https")){
            console.log(entry);
          }else{
            //add the key and value to the contentdata object
            contentdata[entry] = res.data.data[entry];
          }
        }
  
        setDatacrateContent(contentdata);
        console.log(res.data.data);
        setLoading(false);
      }
      ).catch(err => {
        console.log(err);
        setError(true);
        setErrorMessage(err);
        setLoading(false);
      }
      );
    }
  }, [exploreradded]);


  //useEffect that gets triggered by a change in DeleteAnnotation, if deleteAnnotationFile is false then it will get annotations for the file and set the state of DatacrateContent to the annotations
  useEffect(() => {
    if(!DeletingAnnotation){
      if(modalContent.file_name){
        console.log(modalContent.file_name);
        getAnnotationsFile(datacrate_uuid, encodeURIComponent(modalContent.file_name)).then(res => {
          console.log(res.data);
          setSpecificFileContent(res.data);
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


  //useffect that gets triggered by a change in AddingAnnotation, if adding annotation is false it will get annotations for file and set the state to the annotations
  useEffect(() => {
    if(!AddingAnnotation){
      if(modalContent.file_name){
        console.log(modalContent.file_name);
        getAnnotationsFile(datacrate_uuid, encodeURIComponent(modalContent.file_name)).then(res => {
          console.log(res.data);
          setSpecificFileContent(res.data);
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
      for(let entry in res.data.data){
        if(entry.includes("http") || entry.includes("https")){
          console.log(entry);
        }else{
          //add the key and value to the contentdata object
          contentdata[entry] = res.data.data[entry];
        }
      }

      setDatacrateContent(contentdata);
      console.log(res.data.data);
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
      console.log(modalContent.file_name);
      getAnnotationsFile(datacrate_uuid, encodeURIComponent(modalContent.file_name)).then(res => {
        console.log(res.data);
        setSpecificFileContent(res.data);
      }).catch(err => {
        console.log(err);
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
      console.log(specificFileContent);
      console.log(Object.keys(specificFileContent));
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
                 postBlanknoteFile
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
    return LoadingBlock("Fetching Datacrate Content, this can take a while");
  }
  if (error) {
    return <AxiosError errorMessage={errorMessage} />;
  }
  else{
    return (
      <>
      <div className="component">
        <div className="title">Files</div>
        {FileActions(setExploreradded, datacrate_uuid, Showuploadmodal, setShowuploadmodal)}
        <div className="searchbar">
          placeholder searchbar
        </div>
        {Object.keys(DatacrateContent).map((key) => {
          return DatacrateContentFileRow(key,datacrate_uuid,DatacrateContent[key],setShowmodal, setModalContent, setSpecificFileContent);
        }
        )}
      </div>
      {MakeModal()}
      </>
    )
  }
}

export default DatacrateContentFileTable
