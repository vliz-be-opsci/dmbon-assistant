
import {useNavigate, useParams} from 'react-router-dom';
import {Table} from 'react-bootstrap';
function FilesView(props) {

    //get the current params from the url
    const {SpaceId} = useParams();


    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>File Name</th>
                        <th>Location local storage</th>
                    </tr>
                </thead>
                <tbody>
                    {props.listfiles.map(file =>
                        <tr>
                            <td>
                                <a href={ '/spaces/'+SpaceId+'/'+ file.file}>{file.file} </a>
                            </td>
                            <td>
                                {file.folder}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>    
        </div>
    )
}

export default FilesView