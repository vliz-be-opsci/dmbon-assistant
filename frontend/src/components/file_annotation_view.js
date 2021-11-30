import {Table} from 'react-bootstrap';

function FileAnnotationView(props) {

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Predicate</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {props.listannotations.map(annotation =>
                        <tr>
                            <td>
                                {annotation.predicate}
                            </td>
                            <td>
                                {annotation.value}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>    
        </div>
    )
}

export default FileAnnotationView