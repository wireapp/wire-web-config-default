#!/usr/bin/env node

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

//@ts-check

const https = require('https');
const path = require('path');
const fs = require('fs');

const AdmZip = require('adm-zip');
const sortJson = require('sort-json');
const {destinationPath, projectIdentifier, projectKey} = require('../keys/crowdinConfig');

let projectName;

if ((process.argv[2] === '--project' || process.argv[2] === '-p') && process.argv[3]) {
  projectName = process.argv[3];
} else {
  console.error(`Usage: ${path.basename(__filename)} [--project|-p] <project name>`);
  process.exit(1);
}

const zipPath = path.resolve(__dirname, '../', projectName, `${projectName}.zip`);

const CROWDIN_API = `https://api.crowdin.com/api/project/${projectIdentifier}`;

const URL = {
  DOWNLOAD: `${CROWDIN_API}/download/all.zip?key=${projectKey}`,
  EXPORT: `${CROWDIN_API}/export?key=${projectKey}&json`,
};

function fetchUpdates() {
  return new Promise((resolve, reject) => {
    https.get(URL.EXPORT, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject('Failed to export, status code: ' + response.statusCode);
      }
      response.on('data', () => {
        response.connection.end();
        resolve();
      });
      response.on('error', reject);
    });
  });
}

function download() {
  return new Promise((resolve, reject) => {
    https.get(URL.DOWNLOAD, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject('Failed to download, status code: ' + response.statusCode);
      }
      response.on('data', data => fs.appendFileSync(zipPath, data));
      response.on('end', () => {
        const zip = new AdmZip(zipPath);
        zip.getEntries().forEach(entry => {
          if (!entry.isDirectory) {
            zip.extractEntryTo(entry, destinationPath, false, true);
          }
        });
        fs.unlinkSync(zipPath);
        resolve();
      });

      response.on('error', reject);
    });
  });
}

function sortTranslationJson() {
  return fs.readdirSync(destinationPath).forEach(filename => sortJson.overwrite(path.join(destinationPath, filename)));
}

fetchUpdates()
  .then(() => download())
  .then(() => sortTranslationJson())
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
