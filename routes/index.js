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
  var permissions = (req.get('X-Sandstorm-Permissions') || '').split(',');
  var isReadOnly = permissions.indexOf('write') == -1;

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
    isOneDriveConfigured: OneDrive.isConfigured,
    isReadOnly: isReadOnly
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

