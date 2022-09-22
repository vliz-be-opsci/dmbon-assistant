import DatacrateGitHistoryGraph from 'src/components/DatacrateGitHistoryGraph/DatacrateGitHistoryGraph';
import {useState, useEffect} from 'react';
import { getGitHistory, getGitStatus } from 'src/utils/AxiosRequestsHandlers';
import LoadingBlock from 'src/components/LoadingBlock/LoadingBlock';
import GitActions from '../GitActions/GitActions';
import gitDiffParser from 'gitdiff-parser';
import {parseDiff, Diff, Hunk, Decoration, getChangeKey} from 'react-diff-view';
import 'react-diff-view/style/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const DatacrateGitOverview = (datacrate_id) => {

  const [GitDiff, setGitDiff] = useState("")
  const [Loading, setLoading] = useState(true)
  const [LoadingMessage, setLoadingMessage] = useState("Loading...")
  const [ShowElement, setShowElement] = useState(false)
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ShowModalCommit, setShowModalCommit] = useState(false);
  const [CommitMessage, setCommitMessage] = useState("");
  const [CommitDescription, setCommitDescription] = useState(""); 

  useEffect(() => {
    setLoadingMessage("Loading...")
    setLoading(true)
    getGitHistory(datacrate_id)
      .then(response => {
        //console.log(renderCommit(response.data.data));
        //setHistory(renderCommit(response.data.data));
        //console.log(response.data.data);
        setHistory(response.data.data);
        setLoading(false);
      }
      ).catch(error => {
        setError(true);
        setErrorMessage(error);
        setLoading(false);
      }
      );
    getGitStatus(datacrate_id)
      .then(res => {
        console.log(gitDiffParser.parse(res.data.data));
        setGitDiff(res.data.data);
        setLoading(false);
      }).catch(error => {
        setError(true);
        setErrorMessage(error);
        setLoading(false);
      }
      );
  }, []);

  //component that will be the git diff render 
  const renderDiff = (diffText) => {
    const files = parseDiff(diffText);
    const renderFile = ({oldPath, newPath, oldRevision, newRevision, type, hunks}) => (
      <div key={oldRevision + '-' + newRevision} className="file-diff">
        <header className="diff-header">{oldPath === newPath ? oldPath : `${oldPath} -> ${newPath}`}</header>
        <Diff viewType="unified" diffType={type} hunks={hunks}>
          {hunks =>
            hunks.map(hunk => [
              <Decoration key={'deco-' + hunk.content}>
                <div className="hunk-header">{hunk.content}</div>
              </Decoration>,
              <Hunk key={hunk.content} hunk={hunk} />,
            ])
          }
        </Diff>
      </div>
  );

    return (
        <div>
            {files.map(renderFile)}
        </div>
    );
  }


  //component that determines what to show
  const toshowelement = (datacrate_id) => {
    if(ShowElement){
      return <>{DatacrateGitHistoryGraph(datacrate_id,Loading,history,error,errorMessage)}</>
    }else if(!ShowElement){
      return <>
       {renderDiff(GitDiff)}
      </>
    }
  }


  if(Loading){
    return(LoadingBlock(LoadingMessage));
  }else{
    return (
      <div className='component'>
        <div className="title_file_content">
            <p>Git overview</p>
          {GitActions(datacrate_id,setShowElement,ShowModalCommit, setShowModalCommit,CommitMessage, setCommitMessage,CommitDescription, setCommitDescription)}
        </div>
        
        {toshowelement(datacrate_id)}
        
      </div>
    )
  }
}

export default DatacrateGitOverview
