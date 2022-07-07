import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const SpecificDatacrateGitPage = ({ datacrate_id }) => {
  return (
    <>
      <MetaTags
        title="SpecificDatacrateGit"
        description="SpecificDatacrateGit page"
      />

      <h1>SpecificDatacrateGitPage</h1>
      <p>
        Find me in{' '}
        <code>
          ./web/src/pages/SpecificDatacrateGitPage/SpecificDatacrateGitPage.js
        </code>
      </p>
      <p>
        My default route is named <code>specificDatacrateGit</code>, link to me
        with `
        <Link to={routes.specificDatacrateGit({ datacrate_id: '42' })}>
          SpecificDatacrateGit 42
        </Link>
        `
      </p>
      <p>The parameter passed to me is {datacrate_id}</p>
    </>
  )
}

export default SpecificDatacrateGitPage
