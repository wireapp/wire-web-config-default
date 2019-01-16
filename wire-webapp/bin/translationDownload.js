const https = require('https');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const crowdinConfig = require('../keys/crowdinConfig');
const zipFolder = path.resolve(__dirname, 'wire-webapp.zip');
const translationFolder = crowdinConfig.destinationPath;

const URL = {
  EXPORT: `https://api.crowdin.com/api/project/${crowdinConfig.projectIdentifier}/export?key=${crowdinConfig.projectKey}&json`,
  DOWNLOAD: `https://api.crowdin.com/api/project/${crowdinConfig.projectIdentifier}/download/all.zip?key=${crowdinConfig.projectKey}`,
}

function fetchUpdates() {
  https.get(URL.EXPORT, function(response) {
    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error('Failed to export, status code: ' + response.statusCode);
    }
    response.on('data', function() {
      download();
    });
    response.on('error', function(error) {
      throw new Error(error);
    });
  })
}

function download() {
  https.get(URL.DOWNLOAD, function(response) {
    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error('Failed to download, status code: ' + response.statusCode);
    }
    response.on('data', function (data) {
      fs.appendFileSync(zipFolder, data);
    });
    response.on('end', function() {
      var zip = new AdmZip(zipFolder);
      zip.getEntries().forEach(function(entry) {
        if (!entry.isDirectory) {
          zip.extractEntryTo(entry, translationFolder, false, true);
        }
      });
      fs.unlinkSync(zipFolder);
    });

    response.on('error', function(error) {
      throw new Error(error);
    });
  });
}

fetchUpdates();
