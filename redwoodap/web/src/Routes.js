// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set } from '@redwoodjs/router'

import MainLayout from './layouts/MainLayout/MainLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
        <Route path="/profiles" page={OverviewProfilesPage} name="overviewProfiles" />
        <Route path="/profiles/{profile_id}" page={SpecificProfilePage} name="specificProfile" />
        <Route path="/datacrates" page={OverviewDatacratesPage} name="overviewDatacrates" />
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/" page={HomePage} name="home" />
        <Route path="/settings" page={SettingsPage} name="settings" />
        <Route path="/spaces" page={OverviewSpacesPage} name="overviewSpaces" />
        <Route path="/spaces/{space_id}" page={SpecificSpacePage} name="specificSpace" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
