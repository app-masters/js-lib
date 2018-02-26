# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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