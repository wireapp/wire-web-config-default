/*
 * Wire
 * Copyright (C) 2019 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

const https = require('https');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const sortJson = require('sort-json');

const zipPath = path.resolve(__dirname, 'wire-account.zip');
const crowdinConfig = require('../keys/crowdinConfig');

const URL = {
  DOWNLOAD: `https://api.crowdin.com/api/project/${crowdinConfig.projectIdentifier}/download/all.zip?key=${
    crowdinConfig.projectKey
  }`,
  EXPORT: `https://api.crowdin.com/api/project/${crowdinConfig.projectIdentifier}/export?key=${
    crowdinConfig.projectKey
  }&json`
};

function fetchUpdates() {
  https.get(URL.EXPORT, response => {
    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error('Failed to export, status code: ' + response.statusCode);
    }
    response.on('data', () => download());
    response.on('error', error => {
      throw new Error(error);
    });
  });
}

function download() {
  https.get(URL.DOWNLOAD, response => {
    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error('Failed to download, status code: ' + response.statusCode);
    }
    response.on('data', data => fs.appendFileSync(zipPath, data));
    response.on('end', () => {
      var zip = new AdmZip(zipPath);
      zip.getEntries().forEach(entry => {
        if (!entry.isDirectory) {
          zip.extractEntryTo(entry, crowdinConfig.destinationPath, false, true);
        }
      });
      fs.unlinkSync(zipPath);
      sortTranslationJson();
    });

    response.on('error', error => {
      throw new Error(error);
    });
  });
}

function sortTranslationJson() {
  fs.readdirSync(crowdinConfig.destinationPath).forEach(filename =>
    sortJson.overwrite(path.join(crowdinConfig.destinationPath, filename))
  );
}

fetchUpdates();
