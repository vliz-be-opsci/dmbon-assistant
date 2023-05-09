import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { useEffect, useState } from 'react'
import {getAnnotationsFile, postAnnotationFile, deleteAnnotationFile, postNodeFile} from "src/utils/AxiosRequestsHandlers";
import LoadingBlock from "src/components/LoadingBlock/LoadingBlock";
import AxiosError from 'src/components/AxiosError/AxiosError';
import AnnotationValidationErrorOverview from 'src/components/AnnotationValidationErrorOverview/AnnotationValidationErrorOverview';
import AnnotationTable from 'src/components/AnnotationTable/AnnotationTable';
const SpecificDatacratePageNodePage = ({ datacrate_id, node_id }) => {

  const [datacratecontentfile, setDatacratecontentfile] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [PredicateAnnotation, setPredicateAnnotation] = useState("");
  const [ValueAnnotation, setValueAnnotation] = useState("");
  const [AddingAnnotation, setAddingAnnotation] = useState(false);
  const [DeletingAnnotation, setDeletingAnnotation] = useState(false);
  const [showAnnotationErrors, setShowAnnotationErrors] = useState(true);
  const [allResourceNodes,setAllResourceNodes] = useState([]);

  useEffect(() => {
    getAnnotationsFile(datacrate_id, node_id).then((response) => {
      setDatacratecontentfile(response.data);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
      setErrorMessage(error);
      setError(true);
      setLoading(false);
    });
  }, []);


  if (loading) {
      return LoadingBlock("Fetching Datacrate Content, this can take a while");
  }

  if (error) {
    return <AxiosError errorMessage={errorMessage} />;
  }

  return (
    <>
      <MetaTags
        title="SpecificDatacratePageNode"
        description="SpecificDatacratePageNode page"
      />

      {
        AnnotationValidationErrorOverview(
            datacratecontentfile.shacl_requirements,
            showAnnotationErrors,
            setShowAnnotationErrors,
            datacratecontentfile.data,
            datacrate_id,
            node_id,
            postAnnotationFile,
            setAddingAnnotation,
            postNodeFile,
            allResourceNodes
          )
        }
        <br></br>
        {
        AnnotationTable(
          datacratecontentfile.data,
            PredicateAnnotation,
            setPredicateAnnotation,
            ValueAnnotation,
            setValueAnnotation,
            postAnnotationFile,
            deleteAnnotationFile,
            datacrate_id,
            node_id,
            setAddingAnnotation,
            setDeletingAnnotation,
          )
        }
    </>
  )
}

export default SpecificDatacratePageNodePage
