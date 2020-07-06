# Wire™

This repository is part of the source code of Wire. You can find more information at [wire.com](https://wire.com) or by contacting opensource@wire.com.

You can find the published source code at [github.com/wireapp/wire](https://github.com/wireapp/wire).

For licensing information, see the attached LICENSE file and the list of third-party licenses at [wire.com/legal/licenses/](https://wire.com/legal/licenses/).

If you compile the open source software that we make available from time to time to develop your own mobile, desktop or web application, and cause that application to connect to our servers for any purposes, we refer to that resulting application as an “Open Source App”. All Open Source Apps are subject to, and may only be used and/or commercialized in accordance with, the Terms of Use applicable to the Wire Application, which can be found at https://wire.com/legal/#terms. Additionally, if you choose to build an Open Source App, certain restrictions apply, as follows:

a. You agree not to change the way the Open Source App connects and interacts with our servers; b. You agree not to weaken any of the security features of the Open Source App; c. You agree not to use our servers to store data for purposes other than the intended and original functionality of the Open Source App; d. You acknowledge that you are solely responsible for any and all updates to your Open Source App.

For clarity, if you compile the open source software that we make available from time to time to develop your own mobile, desktop or web application, and do not cause that application to connect to our servers for any purposes, then that application will not be deemed an Open Source App and the foregoing will not apply to that application.

No license is granted to the Wire trademark and its associated logos, all of which will continue to be owned exclusively by Wire Swiss GmbH. Any use of the Wire trademark and/or its associated logos is expressly prohibited without the express prior written consent of Wire Swiss GmbH.

# Usage

## Creating a company repository

1. `git clone https://github.com/wireapp/wire-web-config-<company>.git`
2. `git remote add upstream https://github.com/wireapp/wire-web-config-default.git`
3. `git checkout -b master`
4. `git fetch upstream && git merge upstream/master && git push origin --follow-tags`

## Update company repository

1.  First time only: `git remote add upstream https://github.com/wireapp/wire-web-config-default.git`
2.  Run `yarn sync`

## Setting up translations download (only on `wire-web-config-default`!)

1. Get the API key from crowdin (e.g. https://crowdin.com/project/wire-webapp/settings#api)
2. Create a directory named `keys` in the project's folder
3. Create the file `crowdinConfig.js` in the project's `keys` subfolder (e.g. `./wire-webapp/keys/`):

   ```js
   const path = require('path');

   module.exports = {
     projectKey: '<API key here>',
     projectIdentifier: 'wire-webapp',
     destinationPath: path.resolve(__dirname, '../content/translation'),
   };
   ```
### Download latest translations (only on `wire-web-config-default`!)

1. Run the project's translation command (see [`package.json`](./package.json), e.g. `yarn translate:download:wire-webapp`)
2. Check the changes, notify a colleague if there is anything out of the ordinary
3. Create a branch, commit the changes, create a PR in the following format:
   ```
   chore(<project name>): Update translations for the new feature
   ```
4. Once the PR is merged, create a new version by running `yarn release:patch`

### Workflow: Add a new property

1. Commit the new property (mentioning the related product in the commit message) to "wire-web-config-default" (i.e. [Example](https://github.com/wireapp/wire-web-config-default/commit/3cf240f47989474e5061111aaad2260e9466cdc3))
1. Run `yarn release:patch` to create a new version ([Example](https://github.com/wireapp/wire-web-config-default/commit/dffe84e856c4a8d1e5c911caaa41012c0e02834a)). Please note that `yarn release:prepatch` is reserved for company config repos only.
