import DatacrateGitHistoryGraph from 'src/components/DatacrateGitHistoryGraph/DatacrateGitHistoryGraph';
import {useState, useEffect} from 'react';
import { getGitHistory, getGitDiff, fixDatacrate } from 'src/utils/AxiosRequestsHandlers';
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
  const [ToShowDiffs, setToShowDiffs] = useState([]);
  const [customDiffs, setCustomDiffs] = useState([]);

  useEffect(() => {
    setLoadingMessage("Checking Crate data...")
    //first do fixcrate
    fixDatacrate(datacrate_id)
      .then(res => {
        console.log(res.data)
        setLoadingMessage("Loading Git history...")
        setLoading(true)
        getGitHistory(datacrate_id)
          .then(response => {
            //console.log(renderCommit(response.data.data));
            //setHistory(renderCommit(response.data.data));
            //console.log(response.data.data);
            setHistory(response.data.data);
            setLoadingMessage("Getting Git Diff...")
            getGitDiff(datacrate_id)
              .then(res => {
                console.log(res)
                console.log(gitDiffParser.parse(res.data));
                //perform custom diff function
                customDiff(res.data);
                setGitDiff(res.data);
                setLoading(false);
              }).catch(error => {
                setError(true);
                setErrorMessage(error);
                setLoading(false);
              }
              );
          }
          ).catch(error => {
            setError(true);
            setErrorMessage(error);
            setLoading(false);
          }
          );
      }
      ).catch(error => {
        setError(true);
        setErrorMessage(error);
        setLoading(false);
      });
  }, []);

  //useeffect that get the toshowdiffs
  useEffect(() => {
    if(GitDiff != ""){
      const files = parseDiff(GitDiff);
      for (const file of files) {
        setToShowDiffs(prevState => [...prevState, file.newPath]);
      }
    }
  }, [GitDiff]);

  //function customdiff that will parse the diff string and split the string on diff --git
  const customDiff = (diffString) => {
    /*
    const diffArray = diffString.split("diff --git");
    //loop through array and remove the first element , then split on \n
    for (let i = 0; i < diffArray.length; i++) {
      if (i == 0) {
        diffArray.shift();
      }
      const diffArraySplit = diffArray[i].split("\n");
      //loop through array
      for (let j = 0; j < diffArraySplit.length; j++) {
        console.log(diffArraySplit[j]);
      }
    }*/
    console.log(diffString);
  }

  //component that will be the git diff render
  const renderDiff = (diffText) => {
    const files = parseDiff(diffText);
    const buttontext = (newPath) => {
      //if newpath is in the list of files to show then return hide else return show
      if (ToShowDiffs.includes(newPath)) {
        return "Hide"
      }
      else {
        return "Show"
      }
    }

    const checkifshow = (newPath) => {
      //if newpath is in the list of files to show then delete it from the list else add it to the list
      if (ToShowDiffs.includes(newPath)) {
        setToShowDiffs(ToShowDiffs.filter(item => item !== newPath))
      }
      else {
        setToShowDiffs(prevState => [...prevState, newPath]);
      }
    }

    console.log(ToShowDiffs);

    const renderFile = ({oldPath, newPath, oldRevision, newRevision, type, hunks}) => {

      //if newpath is in the list of files to show then return the diff else return null
      if (ToShowDiffs.includes(newPath)) {
        return(
          <div key={oldRevision + '-' + newRevision} className="file-diff">
          <header className="diff-header">
            <div className='row_navigation'>
              <b>{oldPath === newPath ? oldPath : `${oldPath} -> ${newPath}`}</b>
              <button className="action_button" onClick={() => checkifshow(newPath)}>{buttontext(newPath)}</button>
            </div>
          </header>
          <Diff viewType="unified" diffType={type} hunks={hunks} id={newPath}>
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
        )
      }
      else {
        return (
        <div key={oldRevision + '-' + newRevision} className="file-diff">
          <header className="diff-header">
            <div className='row_navigation'>
              <b>{oldPath === newPath ? oldPath : `${oldPath} -> ${newPath}`}</b>
              <button className="action_button" onClick={() => checkifshow(newPath)}>{buttontext(newPath)}</button>
            </div>
          </header>
        </div>
    )
      }
    }

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
