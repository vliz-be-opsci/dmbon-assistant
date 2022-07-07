import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const SpecificDatacrateSettingsPage = ({ datacrate_id }) => {
  return (
    <>
      <MetaTags
        title="SpecificDatacrateSettings"
        description="SpecificDatacrateSettings page"
      />

      <h1>SpecificDatacrateSettingsPage</h1>
      <p>
        Find me in{' '}
        <code>
          ./web/src/pages/SpecificDatacrateSettingsPage/SpecificDatacrateSettingsPage.js
        </code>
      </p>
      <p>
        My default route is named <code>specificDatacrateSettings</code>, link
        to me with `
        <Link to={routes.specificDatacrateSettings({ datacrate_id: '42' })}>
          SpecificDatacrateSettings 42
        </Link>
        `
      </p>
      <p>The parameter passed to me is {datacrate_id}</p>
    </>
  )
}

export default SpecificDatacrateSettingsPage
