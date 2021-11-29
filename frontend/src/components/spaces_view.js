import SpaceItem from "./test_display_list"

function SpacesView(props) {
    return (
        <div>
            <ul>
                {props.spaceList.map((space,i)=> <SpaceItem space = {space} />)}
            </ul>
        </div>
    )
}

export default SpacesView