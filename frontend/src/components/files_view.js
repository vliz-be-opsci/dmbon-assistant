
import {useParams} from 'react-router-dom';
import {Table} from 'react-bootstrap';
import { FaArrowLeft } from "react-icons/fa";
import PredicateProgressbar from './predicates_progressbar';
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';


const Relative_folder = (folder) => {
    const {SpaceId} = useParams();
    try {
        console.log(folder);
        let toreturn = folder.split(SpaceId)[1];
        let returno = toreturn.replace('\\project','');
        returno = returno.replaceAll('\\','/');
        console.log(returno);
        if(returno.length == 0){
            const returnoo = '/'
            return returnoo
        }
        console.log(returno);
        return (returno)
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
            <CheckboxGroup onChange={console.log} id="checkAll">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th><AllCheckerCheckbox /></th>
                        <th className="filetd">File Name</th>
                        <th>Relative storage location</th>
                        <th>Semantic Progress</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <a href={parenturl}>./ <FaArrowLeft /></a>
                        </td>
                    </tr>
                    {props.listfiles.map(file =>
                        <tr>
                            <td><Checkbox value={file.file} /></td>
                            <td className="filetd">
                            <a href={ '/spaces/'+SpaceId+'/all_files/'+ file.file}>{file.file} </a>
                            </td>
                            <td>
                                <a href={ '/spaces/'+SpaceId+'/files'+ Relative_folder(file.folder)}>{Relative_folder(file.folder)} </a>
                            </td>
                            <td>
                                <PredicateProgressbar key={props.key} filee={file.file}/>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>    
            </CheckboxGroup>
        </div>
    )
}

export default FilesView