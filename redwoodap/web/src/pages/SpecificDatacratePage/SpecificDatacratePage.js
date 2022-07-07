import { Link, routes } from '@redwoodjs/router';
import { MetaTags } from '@redwoodjs/web';
import DatacrateContentStatistics from 'src/components/DatacrateContentStatistics/DatacrateContentStatistics';
import DatacrateGitStatus from 'src/components/DatacrateGitStatus/DatacrateGitStatus';
import DatacrateNavigation from 'src/components/DatacrateNavigation/DatacrateNavigation';
const SpecificDatacratePage = ({ datacrate_id }) => {
  //render here
  return (
    <>
      <MetaTags
        title="SpecificDatacrate"
        description="SpecificDatacrate page"
      />

      <h1>SpecificDatacratePage</h1>
      {DatacrateNavigation(datacrate_id)}
      {DatacrateContentStatistics(datacrate_id)}
      {DatacrateGitStatus(datacrate_id)}
      <div className='component'>PlaceHolder for Publication info component here</div>
    </>
  )

}

export default SpecificDatacratePage
