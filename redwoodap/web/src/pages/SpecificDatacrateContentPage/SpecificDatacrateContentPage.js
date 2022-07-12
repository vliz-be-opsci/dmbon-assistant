import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import DatacrateNavigation from 'src/components/DatacrateNavigation/DatacrateNavigation';
import DatacrateContentFileTable from 'src/components/DatacrateContentFileTable/DatacrateContentFileTable';
import DatacrateContentResourceTable from 'src/components/DatacrateContentResourceTable/DatacrateContentResourceTable';
const SpecificDatacrateContentPage = ({ datacrate_id }) => {
  return (
    <>
      <MetaTags
        title="SpecificDatacrateContent"
        description="SpecificDatacrateContent page"
      />
      {DatacrateNavigation(datacrate_id)}
      {DatacrateContentFileTable(datacrate_id)}
      {DatacrateContentResourceTable(datacrate_id)}
    </>
  )
}

export default SpecificDatacrateContentPage
