import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const SpecificDatacratePageNodePage = ({ datacrate_id, node_id }) => {
  return (
    <>
      <MetaTags
        title="SpecificDatacratePageNode"
        description="SpecificDatacratePageNode page"
      />

      <h1>SpecificDatacratePageNodePage</h1>

      <p>
        Find me in
        <code>
          ./web/src/pages/SpecificDatacratePageNodePage/SpecificDatacratePageNodePage.js
        </code>
      </p>

      <p>
        My default route is named
        <code>specificDatacratePageNode</code>, link to me with `
        <Link to={routes.specificDatacratePageNode({ datacrate_id: '42' , node_id: 'lol'})}>
          SpecificDatacratePageNode 42
        </Link>
        `
      </p>

      <p>The parameter passed to me is {datacrate_id}</p>
      <p>The parameter passed to me is {node_id}</p>
    </>
  )
}

export default SpecificDatacratePageNodePage
