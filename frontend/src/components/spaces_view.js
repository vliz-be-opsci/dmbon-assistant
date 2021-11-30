
function SpacesView(props) {

    return (
        <div>
            {props.listspace.map(space =>
                <ul>
                    <a href={'/spaces/' + space.name}>
                        <button className="bg-info">
                            <div >
                                <h5>
                                    space id : {space.name}
                                </h5>
                                <h6>
                                    profile : {space.RO_profile}
                                </h6>
                                <h6>
                                    storage-path : {space.storage_path}
                                </h6>
                            </div>
                        </button>
                    </a>
                </ul>
            )}
        </div>
    )
}

export default SpacesView