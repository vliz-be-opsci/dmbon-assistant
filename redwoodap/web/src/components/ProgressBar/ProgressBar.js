import ProgressBar from 'react-bootstrap/ProgressBar'

const ProgressBarContent = (content) => {
  const display = content.content;

  return (
    <ProgressBar>
      <ProgressBar striped variant="success" now={display.green} label={`${display.green}%`} key={1} />
      <ProgressBar striped variant="warning" now={display.orange} label={`${display.orange}%`} key={2} />
      <ProgressBar striped variant="danger" now={display.red} label={`${display.red}%`} key={3} />
    </ProgressBar>
  )
}

export default ProgressBarContent
