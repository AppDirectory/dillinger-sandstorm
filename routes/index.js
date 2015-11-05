var path = require('path')
  , request = require('request')
  , qs = require('querystring')
  , fs = require('fs')
  , Dropbox = require( path.resolve(__dirname, '../plugins/dropbox/dropbox.js') ).Dropbox
  , Github = require( path.resolve(__dirname, '../plugins/github/github.js') ).Github
  , GoogleDrive = require('../plugins/googledrive/googledrive.js').GoogleDrive
  , OneDrive = require('../plugins/onedrive/onedrive.js').OneDrive

// Show the home page
exports.index = function(req, res) {

  // Some flags to be set for client-side logic.
  var indexConfig = {
    isDropboxAuth: !!req.session.isDropboxSynced,
    isGithubAuth: !!req.session.isGithubSynced,
    isEvernoteAuth: !!req.session.isEvernoteSynced,
    isGoogleDriveAuth: !!req.session.isGoogleDriveSynced,
    isOneDriveAuth: !!req.session.isOneDriveSynced,
    isDropboxConfigured: Dropbox.isConfigured,
    isGithubConfigured: Github.isConfigured,
    isGoogleDriveConfigured: GoogleDrive.isConfigured,
    isOneDriveConfigured: OneDrive.isConfigured
  }

  if (!req.session.isEvernoteSynced) {
    console.warn('Evernote not implemented yet.')
  }

  if (req.session.github && req.session.github.username) indexConfig.github_username = req.session.github.username
  return res.render('index', indexConfig)

}

// Show the not implemented yet page
exports.not_implemented = function(req, res) {
  res.render('not-implemented')
}

exports.ensureWritePermission = function(req, res, next) {
  var permissions = (req.get('X-Sandstorm-Permissions') || '').split(',');
  var canWrite = permissions.indexOf('write') != -1;
  if (!canWrite) {
    return res.sendStatus(403);
  }
  next();
}

var filePath = '/var/dillinger/file.md';

exports.save = function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  var text = req.body.text || '';

  fs.writeFile(filePath, text, function (err) {
    if (err) {
      console.log('ERROR: Cannot write file.md');
      console.log(err);
      return res.sendStatus(500);
    }

    res.sendStatus(200);
  });
}

exports.load = function(req, res) {
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      throw err;
    }

    res.json({'text': data});
  });
}
