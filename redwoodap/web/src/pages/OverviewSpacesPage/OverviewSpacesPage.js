import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const OverviewSpacesPage = () => {
  return (
    <>
      <MetaTags title="OverviewSpaces" description="OverviewSpaces page" />

      <h1>OverviewSpacesPage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/OverviewSpacesPage/OverviewSpacesPage.js</code>
      </p>
      <p>
        My default route is named <code>overviewSpaces</code>, link to me with `
        <Link to={routes.overviewSpaces()}>OverviewSpaces</Link>`
      </p>
    </>
  )
}

export default OverviewSpacesPage
