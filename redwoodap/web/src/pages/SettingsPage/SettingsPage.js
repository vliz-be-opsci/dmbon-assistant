import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const SettingsPage = () => {
  return (
    <>
      <MetaTags title="Settings" description="Settings page" />

      <h1>SettingsPage</h1>
      <p>
        Find me in <code>./web/src/pages/SettingsPage/SettingsPage.js</code>
      </p>
      <p>
        My default route is named <code>settings</code>, link to me with `
        <Link to={routes.settings()}>Settings</Link>`
      </p>
    </>
  )
}

export default SettingsPage
