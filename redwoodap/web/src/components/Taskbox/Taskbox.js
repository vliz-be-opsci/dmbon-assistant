import './Taskbox.css'

const Taskbox = ({type, name, description}) => {
  return (
    <div className={"task "+ type}>
      <h2 className='task-title'>{name}</h2>
      <p className='task-description'>{description}</p>
    </div>
  )
}

export default Taskbox