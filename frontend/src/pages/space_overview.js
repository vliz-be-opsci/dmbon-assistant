import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ReactLoading from 'react-loading';
function SpaceOverviewPage() {

    //define all constants first
    //All the functions here
    const {SpaceId} = useParams();
    const [ShaclSummary, SetShaclSummary] = useState({});
    const [ShaclOverview, SetShaclOverview] = useState([{}]);
    const [Loading, setLoading] = useState(true); 
    const [ShaclErrors, SetShaclErrors] = useState(0);
    const [Graphdata, SetGraphdata] = useState({});

    ChartJS.register(ArcElement, Tooltip, Legend);
    var dummydata = {
        labels: ['Violations (%)', 'Good (%)', 'Warnings (%)'],
        datasets: [
          {
            label: '# of Votes',
            data: [70, 10, 20],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };

    //have axios call to get all the semantic data for the space 
    const fetchShaclOverview = async() => {
        if(SpaceId){
            axios.get(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/annotation/shacl_report`)
            .then(res => {
                console.log(res)
                var shacl_requirements = res.data.shacl_requirements;
                console.log(shacl_requirements);
                SetShaclOverview(shacl_requirements);
                SetShaclSummary(res.data.summary);
                console.log(res.data.summary["red"]);
                //set graphdata
                SetGraphdata(
                    {
                        labels: ['Violations (%)', 'Good (%)', 'Warnings (%)'],
                        datasets: [
                          {
                            label: '# of Votes',
                            data: [res.data.summary["red"], res.data.summary["green"], res.data.summary["orange"]],
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.2)',
                              'rgba(75, 192, 192, 0.2)',
                              'rgba(255, 159, 64, 0.2)',
                            ],
                            borderColor: [
                              'rgba(255, 99, 132, 1)',
                              'rgba(75, 192, 192, 1)',
                              'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }
                )
                //get the number of shacl errors that are in shacl_requirements
                try{var ammount_violations = shacl_requirements[0]["http://www.w3.org/ns/shacl#result"].length;console.log(ammount_violations);SetShaclErrors(ammount_violations);}
                catch(error){console.log(error);var ammount_violations = 0;}
                setLoading(false);
            })
        }  
        
    }

    useEffect(() => {
        fetchShaclOverview();
    }, [])

    if(Loading){
        return(
            <div class="busy">
                <ReactLoading type='bars' color='#006582' height={'20vw'} width={'20vw'} />
            </div>
        )
    }else{
        return (
            <div>
                <h1>TODO: dashboard space </h1>
                <ol>
                    <li>semantic progress overview</li>
                    <li>git overview</li>
                    <li>publish overview</li>
                </ol>
                <a href={`/spaces/${SpaceId}/all_files`}>see all files</a>
                <div><Doughnut data={Graphdata} width="200px" height="200px" options={{maintainAspectRatio:false, plugins:{legend:{display:false}}}}/></div>
                
            </div>
        )
    }
    
}

export default SpaceOverviewPage