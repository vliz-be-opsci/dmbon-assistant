import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const SpecificDatacrateContentPage = ({ datacrate_id }) => {
  return (
    <>
      <MetaTags
        title="SpecificDatacrateContent"
        description="SpecificDatacrateContent page"
      />

      <h1>SpecificDatacrateContentPage</h1>
      <p>
        Find me in{' '}
        <code>
          ./web/src/pages/SpecificDatacrateContentPage/SpecificDatacrateContentPage.js
        </code>
      </p>
      <p>
        My default route is named <code>specificDatacrateContent</code>, link to
        me with `
        <Link to={routes.specificDatacrateContent({ datacrate_id: '42' })}>
          SpecificDatacrateContent 42
        </Link>
        `
      </p>
      <p>The parameter passed to me is {datacrate_id}</p>
    </>
  )
}

export default SpecificDatacrateContentPage
