
import {useParams} from 'react-router-dom';
import {Table} from 'react-bootstrap';
import { FaArrowLeft } from "react-icons/fa";
 const Relative_folder = (folder) => {
    const {SpaceId} = useParams();
    try {
        console.log(folder);
        const toreturn = folder.split(SpaceId)[1];
        console.log(toreturn);
        return (toreturn)
    } catch (error) {
        return('')
    }
}

//get the current url to know the parent
const url = window.location.href;
const parenturl = url.substr(0,url.lastIndexOf('/'))

function FilesView(props) {
    //get the current params from the url
    const {SpaceId} = useParams();
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>File Name</th>
                        <th>Relative storage location</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <a href={parenturl}>./ <FaArrowLeft /></a>
                        </td>
                    </tr>
                    {props.listfiles.map(file =>
                        <tr>
                            <td>
                                <a href={ '/spaces/'+SpaceId+'/all_files/'+ file.file}>{file.file} </a>
                            </td>
                            <td>
                                <a href={ '/spaces/'+SpaceId+'/files'+ Relative_folder(file.folder)}>{Relative_folder(file.folder)} </a>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>    
        </div>
    )
}

export default FilesView