import 'bootstrap/dist/css/bootstrap.min.css';
import '.././css/spinner.css';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import React, {useState, useEffect, useRef} from 'react';
import 'react-gh-like-diff/dist/css/diff2html.min.css';
import {Form, Forms, Button} from 'react-bootstrap';
import { Formik } from 'formik';

function ShaclForm() {
    const [shaclList, setShaclList] = useState([]) 
    const countRef = useRef(0);
    const {SpaceId} = useParams();
    const {FileId}  = useParams();
    //All the functions here

    const fetchShacl = async () => {
        axios.get(process.env.REACT_APP_BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/annotation/file/${FileId}`)
        .then(res => {
            setShaclList(res.data.shacl_requirements)
            console.log(res.data.shacl_requirements);
            countRef.current++;
            // build the UI from the shacl requirements


        })
    }

    const LogicShaclComponent = (component) => {
        let toreturn
        if(component.min > 0){
            if(component.typeprop == "String" || component.typeprop == "http://www.w3.org/2001/XMLSchema#string"){
                if(component.value.length > 0 ){
                    //make the optionlist
                    let optionlist = [];
                    for (let item = 0; item < component.value.length; item++){
                        optionlist.push(<option value={item}>{component.value[item]}</option>)
                    }
                    toreturn = <><Form.Group><Form.Label>{component.label}</Form.Label><Form.Select required aria-label="Default select example">
                                    {optionlist}
                                </Form.Select></Form.Group></>
                }
                if(component.value.length == 0 ){
                    toreturn = <><Form.Group><Form.Label>{component.label}</Form.Label><Form.Control required type="text"  placeholder={component.label}/></Form.Group></>
                }
            }
        }
        if(component.min == 0){
            if(component.typeprop == "String" || component.typeprop == "http://www.w3.org/2001/XMLSchema#string"){
                if(component.value.length > 0 ){
                    //make the optionlist
                    let optionlist = [];
                    for (let item = 0; item < component.value.length; item++){
                        optionlist.push(<option value={item}>{component.value[item]}</option>)
                    }
                    toreturn = <><Form.Group><Form.Label>{component.label}</Form.Label><Form.Select aria-label="Default select example">
                                    {optionlist}
                                </Form.Select></Form.Group></>
                }
                if(component.value.length == 0 ){
                    toreturn = <><Form.Group><Form.Label>{component.label}</Form.Label><Form.Control type="text"  placeholder={component.label}/></Form.Group></>
                }
            }
        }
        return toreturn
    }


    const shaclrender = (shacllist) => {
        let shaclUI = [];
        let formikInitialVals = {};
        for (let i = 0; i < shacllist.shaclList.length; i++) {
            console.log(shacllist.shaclList[i]);
            formikInitialVals[shacllist.shaclList[i].label] = "";
            //perform other function to determine the UI of the element
            shaclUI.push(LogicShaclComponent(shacllist.shaclList[i]));
            //shaclUI.push(<><Form.Group><Form.Label>{shacllist.shaclList[i].label}</Form.Label><Form.Control type="text"  placeholder={shacllist.shaclList[i].label} /></Form.Group></>);
          }
          console.log(formikInitialVals);
        return(<>
        <Formik onSubmit={console.log} initialValues={formikInitialVals}>
        {( {values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
            {shaclUI.map(file =>
                    <>{file} </>
            )}
            <hr />
        <Button variant="primary" type="submit">
            Submit
        </Button>
        </Form>
      )}
        </Formik>
        </>)
    }

    useEffect(() => {
        fetchShacl();
    },[]);

        return (
            <div>
                {shaclrender({shaclList})}
            </div>
        )
}
    
export default ShaclForm