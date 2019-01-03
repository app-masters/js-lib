# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
setHeaderParam

## [1.2.0] - 2019-01-03
### Added
- LaravelErrorHandler for deal with the new error standards

## [1.1.55] - 2018-11-07
### Changed
- Added humanizeDistance on Text

## [1.1.51] - 2018-11-07
### Changed
- Changed [DateTime.relative](/src/dateTime.js) to use `moment`

## [1.1.51] - 2018-11-07
### Changed
- Changed Plural into a singleton

## [1.1.50] - 2018-11-07
### Changed
- Added Plural module

## [1.1.44] - 2018-11-07
### Changed
- Removing body from http.delete

# [1.1.41] - 2018-08-21
### Fixed
- Changed compiling to prepublishOnly and changed to Babel 7

# [1.1.32] - 2018-08-21
### Fixed
- Fix on DateTime.relative

# [1.1.31] - 2018-08-21
### Added
- Text.isNormalInteger added, checks if a string is a number

## [1.1.28/1.1.30] - 2018-08-02
### Changed
- Text.slugify accept a replace object param 

## [1.1.27] - 2018-07-13
### Changed
- Fix to call ucWords on firstname


## [1.1.23] - 2018-05-04
### Added
- setHeaderParam method on HTTP

## [1.1.24] - 2018-05-04
- added "same origin" param on HTTP

## [1.1.22] - 2018-03-09
### Fixed
- Fixing checkToken and setToken

## [1.1.21] - 2018-03-05
### Changed
- Checking the permission before getting the token

## [1.1.20] - 2018-03-05
### Changed
- Minor fixes on the check token method. Now the method sets the auth storage

## [1.1.19] - 2018-03-02
### Changed
- Minor fixes on the check token method and the http call

## [1.1.12/1.1.18] - 2018-03-01
### Changed
- Added check token
- Firebase import no more on notificationWeb
- All the Notification.getToken() functions makes a different callback sending the current object: notification = {'platform': token}
- HttpErrorHandler deals with text promises
- Error.mount now return promises

## [1.1.10/1.1.11] - 2018-02-26
### Changed
- Notification Web now receives a firebase instance pre-loaded

## [1.1.8/1.1.9] - 2018-02-26
### Changed
- AppBoostrap now sets the config.notification on the Notification class

## [1.1.4/1.1.7] - 2018-02-26
### Added
- Client notification for cordova and webapp

## [1.1.0/1.1.3] - 2018-02-16
### Added
- Error handler in Http: now the fetch errors are handled correctly
### Changed
- AppBootstrap now use the new Http.setup and set the callbacks for Http errors
- Deprecated warning on Http.setHeaders

## [1.0.25] - 2018-02-15
### Changed
- Http.reset and Http.setup created to simplify the bootstrap

## [1.0.24] - 2018-01-22
### Changed
- Text.formatNumber and Text.formatReal added

## [1.0.23] - 2018-01-10
### Changed
- VersionCheck.onNewVersion is now async

## [1.0.22] - 2018-01-09
### Changed
- storage.hasItem now reject on catch of getItem

## [1.0.21] - 2017-12-20
### Changed
- Created http download method

## [1.0.20] - 2017-12-19
### Changed
- Fixed http checkStatus and checkListener order

## [1.0.18/1.0.19] - 2017-12-12
### Changed
- Fixing relative data result

## [1.0.15/1.0.17] - 2017-11-27
### Changed
- Fixing rounding on DateTime.secondsToHour

## [1.0.14] - 2017-11-23
### Added
- relative and humanize added to DateTime

## [1.0.13] - 2017-11-17
### Changed
- AppBoostrap changed to work with mobile

## [1.0.12] - 2017-11-17
### Added
- AppBoostrap.getConfig()

## [1.0.11] - 2017-11-14
### Changed
- AppBoostrap build time on console

## [1.0.9] / [1.0.10] - 2017-11-14
### Added
- Object Handler for javascript objects methods

### Changed
- Fixes in export

## [1.0.8] - 2017-11-9
### Changed
- AppBootstrap() changed to AppBootstrap.setup()

## [1.0.3] / [1.0.7] - 2017-11-8
### Changed
- AppBootstrap fixes
- Http changed fetch to window.fetch.bind(window) - observe it

## [1.0.2] - 2017-11-7
### Added
- AppBootstrap included (src and test)

## [1.0.1] - 2017-10-31
### Added
- Some added

### Changed
- Some change

### Removed
- Some remove
