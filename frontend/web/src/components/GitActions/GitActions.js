import {Modal} from "react-bootstrap";
import {RiGitRepositoryCommitsLine} from "react-icons/ri";
import {GoRepoPull} from "react-icons/go";
import {MdHistoryEdu} from "react-icons/md";
import {FaHistory} from "react-icons/fa";
import {ImParagraphLeft} from "react-icons/im";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { postGitCommand } from "src/utils/AxiosRequestsHandlers";
const GitActions = (datacrate_id, setShowElement,ShowModalCommit, setShowModalCommit,CommitMessage, setCommitMessage,CommitDescription, setCommitDescription) => {

  //make overlay tooltip for each button
  const renderTooltip = (props) => (
    <Tooltip id={`tooltip-${props}`}>
      <p>{props}</p>
    </Tooltip>
  );

  const handleCommit = () => {

    const payload = {"message": [CommitMessage, CommitDescription].join("\n")};
    console.log(payload);

    postGitCommand(datacrate_id, "commit", payload)
      .then(response => {
        console.log(response);
        setShowModalCommit(false);
      }
      ).catch(error => {
        console.log(error);
      }
      );
  }



  return (
    <>
      <div className='row_navigation' >
        <OverlayTrigger placement="bottom" overlay={renderTooltip("git commit")}>
          <button className='action_button' onClick={() => setShowModalCommit(true)}>
            <div><MdHistoryEdu></MdHistoryEdu></div>
          </button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={renderTooltip("Git diff overview")}>
        <button className='action_button' onClick={() => setShowElement(false)}>
            <div><ImParagraphLeft></ImParagraphLeft></div>
        </button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={renderTooltip("graph history overview")}>
        <button className='action_button' onClick={() => setShowElement(true)}>
            <div><FaHistory></FaHistory></div>
        </button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={renderTooltip("perform pull request on repo")}>
        <button className='action_button' onClick={() => postGitCommand(datacrate_id,"pull",{"message": "summary_message"})}>
            <div><GoRepoPull></GoRepoPull></div>
        </button>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={renderTooltip("perform push request on repo")}>
        <button className='action_button' onClick={() => postGitCommand(datacrate_id,"push",{"message": "summary_message"})}>
            <div><RiGitRepositoryCommitsLine></RiGitRepositoryCommitsLine></div>
        </button>
        </OverlayTrigger>
      </div>
      <Modal show={ShowModalCommit} onHide={() => setShowModalCommit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Commit message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="summary_message">Summary message</label>
            <input type="text" className="form-control" id="summary_message" placeholder="Enter summary message" onChange={(e) => setCommitMessage(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="description_message">Description message</label>
            <textarea className="form-control" id="description_message" rows="3" onChange={(e) => setCommitDescription(e.target.value)}></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={() => setShowModalCommit(false)}>Close</button>
          <button type="button" className="btn btn-primary" onClick={() => handleCommit()}>Commit</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default GitActions
