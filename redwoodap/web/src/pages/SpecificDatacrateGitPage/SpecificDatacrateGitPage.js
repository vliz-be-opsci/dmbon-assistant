import { MetaTags } from '@redwoodjs/web'
import DatacrateNavigation from 'src/components/DatacrateNavigation/DatacrateNavigation';
import DatacrateGitOverview from 'src/components/DatacrateGitOverview/DatacrateGitOverview';


const SpecificDatacrateGitPage = ({ datacrate_id }) => {
    return (
      <>
        <MetaTags
          title="SpecificDatacrateGit"
          description="SpecificDatacrateGit page"
        />
        {DatacrateNavigation(datacrate_id)}
        {DatacrateGitOverview(datacrate_id)}
      </>
    )
}

export default SpecificDatacrateGitPage
