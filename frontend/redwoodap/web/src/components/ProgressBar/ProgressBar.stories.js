import ProgressBar from './ProgressBar'

const content = {
  "green": 27,
  "orange": 27,
  "red": 47
}

export const generated = () => {
  return (<ProgressBar content={content}/>)
}

export default { title: 'Components/ProgressBar' }
