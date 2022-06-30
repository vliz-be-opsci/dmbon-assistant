import './Taskbox.css'

const Taskbox = ({type, name, description}) => {
  return (
    <div className={"task "+ type}>
      <h2>{name}</h2>
      <p>{description}</p>
    </div>
  )
}

export default Taskbox
