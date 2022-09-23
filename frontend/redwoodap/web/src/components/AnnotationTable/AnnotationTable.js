//third party imports here
import {FaTrashAlt} from 'react-icons/fa';
import {AiOutlinePlusSquare} from 'react-icons/ai';

const AnnotationTable = (Annotations, predicate, setpredicate, value, setvalue, AddingAnnotation,deleteAnnotationFile,datacrate_uuid,filename,setAddingAnnotation,setDeletingAnnotation) => {

  //the annotatons are a list of dict that contains the following keys: [predicate , value]
  console.log(Annotations);
  console.log(datacrate_uuid);
  console.log(filename);

  //function that will format inputs of the form and post them to AddingAnnotation
  const PostAnnotion = () => {
    //id, file_id, annotation

    //format the filename to be uri compliant
    let formatted_filename = encodeURIComponent(filename);

    //make the payload according to following standards: {"Annotations": [{"URI_predicate_name": "string","value": "string"}]}
    let payload = {
      "Annotations": [
        {
          "URI_predicate_name": predicate,
          "value": value
        }
      ]
    }
    setAddingAnnotation(true);

    //check if predicate and value length is more then 0 and if so post the annotation
    if(predicate.length > 0 && value.length > 0){
      AddingAnnotation(datacrate_uuid, formatted_filename, payload).then(res => {
        setAddingAnnotation(false);
        setpredicate("");
        setvalue("");
      }).catch(err => {
        setAddingAnnotation(false);
      }
      );
    }
  }

  const DeleteAnnotation = (annotation_id) => {
    let formatted_filename = encodeURIComponent(filename);

    //check if the predicate is not @id or @type => if so then return alert that you can't delete that annotation
    if(annotation_id !== "@id" && annotation_id !== "@type"){


      setDeletingAnnotation(true);
      deleteAnnotationFile(datacrate_uuid, formatted_filename, annotation_id).then(res => {
        setDeletingAnnotation(false);
      }).catch(err => {
        setDeletingAnnotation(false);
      }
      );
    }
    else{
      console.log("you can't delete that annotation");
    }
  }


  return (
    <>
      <table className="table_vliz">
        <thead>
          <tr>
            <th>action</th>
            <th>Predicate</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Annotations.map((annotation, index) => {
            return (
              <tr key={index}>
                <td><button onClick={() => DeleteAnnotation(annotation.predicate)}><FaTrashAlt></FaTrashAlt></button></td>
                <td>{annotation.predicate}</td>
                <td>{annotation.value}</td>
              </tr>
            );
          }
          )}
          <tr>
            <td>
              <button onClick={() => PostAnnotion()}><AiOutlinePlusSquare></AiOutlinePlusSquare></button>
            </td>
            <td>
              <input key="predicate_annotation_input" type="text" placeholder="Predicate" value={predicate} onChange={(event) => setpredicate(event.target.value)} />
            </td>
            <td>
              <input key="value_annotation_input" type="text"  placeholder="Value" value={value} onChange={(event) => setvalue(event.target.value)}/>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default AnnotationTable
