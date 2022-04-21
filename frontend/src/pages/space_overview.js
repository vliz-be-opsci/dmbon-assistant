import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {BASE_URL_SERVER} from '../App.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ReactLoading from 'react-loading';
import '../css/space_overview.css';
function SpaceOverviewPage() {

    //define all constants first
    //All the functions here
    const {SpaceId} = useParams();
    const [ShaclSummary, SetShaclSummary] = useState({});
    const [ShaclOverview, SetShaclOverview] = useState([{}]);
    const [Loading, setLoading] = useState(true); 
    const [DoughnutSvg, SetDoughnutSvg] = useState('');
    const [PublicationSvg, SetPublicationSvg] = useState('');
    const [Graphdata, SetGraphdata] = useState({});
    const [legendToggle, SetLegendToggle] = useState(false);
    const [repo_dirty, SetRepoDirty] = useState(false);
    const [ahead, SetAhead] = useState(0);
    const [behind, SetBehind] = useState(0);
    const [repo_message, SetRepoMessage] = useState('');

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
                //determine aextra css properties for the svgs
                if (res.data.summary["green"] == 100){SetDoughnutSvg("checkmark");SetPublicationSvg("ship");}
                if (res.data.summary["red"] > 0){SetDoughnutSvg("cross-red");SetPublicationSvg("ship-non-clickable");}
                if (res.data.summary["red"] == 0 && res.data.summary["green"] != 100){SetDoughnutSvg("checkmark-orange");SetPublicationSvg("ship");}
                //guess the number of errors and warnings by taking the percentage of the red and orage values from summary and multiplying by the number of shacl requirements
                try {
                  var errors = Math.round((res.data.summary["red"]/(res.data.summary["red"]+res.data.summary["orange"])) * shacl_requirements[0]["http://www.w3.org/ns/shacl#result"].length);
                  var warnings = Math.round((res.data.summary["orange"]/(res.data.summary["red"]+res.data.summary["orange"])) * shacl_requirements[0]["http://www.w3.org/ns/shacl#result"].length);
                } catch (error) {
                  console.log(error);
                  var errors = 0;
                  var warnings = 0;
                  var success = 100;
                }
                //set graphdata
                SetGraphdata(
                    {
                        labels: [`Violations: `+errors, 'Warnings: '+warnings],
                        datasets: [
                          {
                            label: '# of Errors',
                            data: [res.data.summary["red"],  res.data.summary["orange"],res.data.summary["green"]],
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.2)',
                              'rgba(255, 159, 64, 0.2)',
                              'rgba(75, 192, 192, 0.2)',
                            ],
                            borderColor: [
                              'rgba(255, 99, 132, 1)',
                              'rgba(255, 159, 64, 1)',
                              'rgba(75, 192, 192, 1)',
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }
                )
            })
        }  
        
    }

    //have axios call to get the git status of the current space git/status
    const fetchGitStatus = async() => {
        if(SpaceId){
            axios.get(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/git/status/`)
            .then(res => {
                console.log(res)
                SetAhead(res.data.ahead);
                SetBehind(res.data.behind);
                SetRepoMessage(res.data.message);
                SetRepoDirty(res.data.dirty);
                setLoading(false);
            })
        }
    }

    //function that makes an axios call to pull data from git for the current spaceid git/pull
    const gitPull = async() => {
      if(SpaceId){
        axios.post(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/git/pull/`)
        .then(res => {
            console.log(res)
            window.location(`spaces/${SpaceId}/all_files`);
        })
      }
    }

    //function that makes an axios call to push data from git for the current spaceid git/push
    const gitPush = async() => {
      if(SpaceId){
        axios.post(BASE_URL_SERVER+`apiv1/spaces/${SpaceId}/git/push/`)
        .then(res => {
            console.log(res)
            window.location.reload();
        })
      }
    }

    //have react component to display the git status
    const GitStatus = () => {
      if(behind > 0 ){
        return(
          <div className="git-status-container">
            <div className="git-status-message">
              <p>Repo is {behind} commit(s) behind the remote, pull to sync</p> 
            </div>
            <div className="git-status-button">
              <button onClick={gitPull} className="git-status-button-pull button_vliz">Pull</button>
            </div>
          </div>
        )
      }
      if(repo_dirty && ahead == 0){
        return(
          <div className="git-status-container">
            <div className="git-status-message">
              <p>There are changes to commit</p>
            </div>
            <a href={`/spaces/${SpaceId}/git`}>
              <div className="git-status-button">
                <button className="button_vliz">Commit changes</button>
              </div>
            </a>
          </div>
        )
      }
      if(ahead > 0 ){
        return(
          <div className="git-status-container">
            <div className="git-status-message">
              <p>Repo is {ahead} commit(s) ahead of the remote, push to sync</p>
            </div>
            <div className="git-status-button">
              <button onClick={gitPush} className="git-status-button-push button_vliz">Push</button>
            </div>
          </div>
        )
      }
      else{
        return(
          <div className="git-status-container">
            <div className="git-status-message">
              <p>All good icon here</p>
            </div>  
          </div>
        )
      }
    }

    const PublicationMessage = () => {
      if(PublicationSvg == "ship-non-clickable"){
        return(
          <div className="publication-message">
            <div className="publication-message-text">
              <b>Fix errors before publishing</b>
            </div>
          </div>
        )
      }else{
        return(
          <div className="publication-message">
            <div className="publication-message-text">
              <b>Publish datacrate</b>
            </div>
          </div>
        )
      }
    }



    useEffect(() => {
        fetchShaclOverview();
        fetchGitStatus();
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
                <br />
                <table style={{width:"100%"}}>
                  <tr className='card_row'>
                    <td style={{width:"33%"}}>
                      <a href={`/spaces/${SpaceId}/all_files`}>
                        <div className={"card_td "+ DoughnutSvg} onMouseEnter={()=> SetLegendToggle(true)} onMouseLeave={()=> SetLegendToggle(false)}>
                          <Doughnut data={Graphdata} width="15px" height="15px" options={{maintainAspectRatio:false, plugins:{legend:{display:legendToggle}}}}/>
                        </div>
                      </a>
                    </td>
                    <td style={{width:"33%"}}>
                      <a>
                        <div className='card_td git'>
                          <GitStatus/>
                        </div>
                      </a>
                    </td>
                    <td style={{width:"33%"}}>
                      <a href={`/`} className={PublicationSvg}><div className={'card_td ' + PublicationSvg}><PublicationMessage/></div></a>
                    </td>
                  </tr>
                </table>    
            </div>
        )
    }
    
}

export default SpaceOverviewPage