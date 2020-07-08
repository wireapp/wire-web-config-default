# Wire™

This repository is part of the source code of Wire. You can find more information at [wire.com](https://wire.com) or by contacting opensource@wire.com.

You can find the published source code at [github.com/wireapp/wire](https://github.com/wireapp/wire).

For licensing information, see the attached LICENSE file and the list of third-party licenses at [wire.com/legal/licenses/](https://wire.com/legal/licenses/).

If you compile the open source software that we make available from time to time to develop your own mobile, desktop or web application, and cause that application to connect to our servers for any purposes, we refer to that resulting application as an “Open Source App”. All Open Source Apps are subject to, and may only be used and/or commercialized in accordance with, the Terms of Use applicable to the Wire Application, which can be found at https://wire.com/legal/#terms. Additionally, if you choose to build an Open Source App, certain restrictions apply, as follows:

a. You agree not to change the way the Open Source App connects and interacts with our servers; b. You agree not to weaken any of the security features of the Open Source App; c. You agree not to use our servers to store data for purposes other than the intended and original functionality of the Open Source App; d. You acknowledge that you are solely responsible for any and all updates to your Open Source App.

For clarity, if you compile the open source software that we make available from time to time to develop your own mobile, desktop or web application, and do not cause that application to connect to our servers for any purposes, then that application will not be deemed an Open Source App and the foregoing will not apply to that application.

No license is granted to the Wire trademark and its associated logos, all of which will continue to be owned exclusively by Wire Swiss GmbH. Any use of the Wire trademark and/or its associated logos is expressly prohibited without the express prior written consent of Wire Swiss GmbH.

# Usage

## Creating a sub repository

1. Create a fork of `https://github.com/wireapp/wire-web-config-(default|wire).git` (Use `wire-web-config-wire` for production builds and `wire-web-config-default` for experimental builds)
1. `git clone https://github.com/<github_organization>/wire-web-config-<company>.git`
1. `git remote add upstream https://github.com/wireapp/wire-web-config-(default|wire).git`
1. `git checkout -b master`
1. `git fetch upstream && git merge upstream/master && git push origin`

## Updating a sub repository

1. First time only: `git remote add upstream https://github.com/wireapp/wire-web-config-(default|wire).git`
1. Run `yarn sync`
1. Resolve possible conflicts
1. Apply adjustments if necessary
1. Once the changes are merged, create a new version by running `yarn release`

# Internal usage

### Update main repository

1. Create a branch, commit the changes, create a PR in the following format:
   ```
   chore(<project name>): Update configuration values
   ```
1. Once the PR is merged, create a new version by running `yarn release:patch:staging`
