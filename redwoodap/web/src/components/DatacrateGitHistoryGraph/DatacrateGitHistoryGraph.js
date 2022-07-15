import React, { useState, useEffect } from 'react'
import LoadingBlock from 'src/components/LoadingBlock/LoadingBlock';
import { Gitgraph } from '@gitgraph/react';
import { getGitHistory } from 'src/utils/AxiosRequestsHandlers';
import AxiosError from 'src/components/AxiosError/AxiosError';
import './DatacrateGitHistoryGraph.css';
import $ from 'jquery';
const DatacrateGitHistoryGraph = (datacrate_id) => {

  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //function that will add renderMessage to the history array commit
  const renderMessage = (commit) => {
    return React.createElement(
      'text',
      { y: 10, alignmentBaseline: 'central', fill: "#000" },
      commit.hashAbbrev,
      ' - ',
      commit.subject
    );
  }

  //function that loops through each commit and then performs the renderMessage function
  const renderCommit = (history_data) => {

    //reverse the array
    history_data.reverse();

    history_data.forEach(commit => {
      commit = renderBranchName(commit, history_data);
    });
    history_data.reverse();
    return history_data;
  }

  //function that will add branchname to the history array commit based in what the parent commit is
  const renderBranchName = (commit, all_commits) => {
    console.log(all_commits);

    //check if commit.parents[0] is ''
    if (commit.parents[0] === '') {
      commit.branch_name = "main";
      commit.new_branch = true;
      commit.merge = false
      return commit
    }
    //check if commit has a parent
    if (commit.parents.length == 1) {
      //get the parent commit
      var parent_commit = all_commits.find(x => x.hash == commit.parents[0]);

      //get parent commit hash
      var parent_commit_hash = parent_commit.hash;

      //check if there are other commits whose parent is the same as the parent commit
      var other_commits = all_commits.filter(x => x.parents[0] == parent_commit_hash);
      //if other commits.length > 1 => get the indexes of the other commits
      if (other_commits.length > 1) {
        var other_commits_indexes = other_commits.map(x => all_commits.indexOf(x));
        //get the index of the current commit
        var current_commit_index = all_commits.indexOf(commit);
        //check if the current_commit_index is the first index of the other_commits_indexes
        if (other_commits_indexes[0] == current_commit_index) {
          commit.branch_name = "main";
          commit.new_branch = false;
          commit.merge = false;
          return commit
        }else{
          //give branch name based on the index of the current commit in the other_commits_indexes
          commit.branch_name = "branch_" + other_commits_indexes.indexOf(current_commit_index);
          commit.new_branch = true;
          commit.merge = false;
          return commit
        }
      }
      //check if parent commit has a branch name
      if (parent_commit.branch_name) {
        //add the branch name to the commit
        commit.branch_name = parent_commit.branch_name;
        return commit
      }
    }

    //check if commit has multiple parents
    if (commit.parents.length > 1) {
      //get the branch name of the last parent
      var parent_commit = all_commits.find(x => x.hash == commit.parents[commit.parents.length - 1]);
      commit.branch_name = parent_commit.branch_name;
      commit.new_branch = false;
      commit.merge = true;
      return commit
    }
    else{
      //if commit has no parent, then it is the first commit in the history
      commit.branch_name = "main";
      commit.new_branch = false;
    }
    return commit;
  }

  useEffect(() => {
    getGitHistory(datacrate_id)
      .then(response => {
        console.log(renderCommit(response.data.data));
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
  }, []);

  if(loading){
    return(LoadingBlock("getting git history..."));
  }
  if(error){
    return(AxiosError(errorMessage));
  }else{
    return (
      <div className='component'>
        <Gitgraph className="gitgraph_svg">{(gitgraph) => (
          gitgraph.import(history)
        )}
        </Gitgraph>
      </div>
    )
  }
}

export default DatacrateGitHistoryGraph
//gitgraph.import(history)

/*
history.map(commit => {
            //check if commit is a new branch
            if (commit.new_branch) {
              //create a new branch
              gitgraph.branch(commit.branch_name);
            }
            //check if commit is a merge
            if (commit.merge) {
              //merge the branch
              gitgraph.merge(commit.branch_name);
            }
            //add commit to the branch
            gitgraph.commit({
                subject: commit.subject,
                renderMessage: renderMessage(commit)
              }
            );
            }
          )
        
*/