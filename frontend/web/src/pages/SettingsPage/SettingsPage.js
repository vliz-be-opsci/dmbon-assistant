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
      <vocab-search-bar
          id="vocab-search-bar"
          query="Mytilus edulis"
          sourceDataset="https://my-application.com/dataset/6380D104B379DA7B645D77D1"
          search-endpoint="https://vocabsearch.redpencil.io"
      > </vocab-search-bar>
    </>
  )
}

export default SettingsPage
