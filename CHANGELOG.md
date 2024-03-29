# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

[Unreleased]: https://github.com/digipolisantwerp/authz_module_nodejs/compare/v0.0.4...HEAD
## [Unreleased] - yyyy-mm-dd

[1.1.0]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v1.1.0
## [1.1.0] - 2023-11-06

- set logging level to output

[1.0.2]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v1.0.2
## [1.0.2] - 2023-10-20

- test setup for node 21
- update dev dependencies

[1.0.1]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v1.0.1
## [1.0.1] - 2023-08-10

- published with tzg -- cleanup

[1.0.0]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v1.0.0
## [1.0.0] - 2023-08-10

- Node 20 support
- fallback to js generated uuid if crypto.randomUUID is unavailable
- 1.0.0 release as package is considered stable & complete

[0.4.0]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v0.4.0
## [0.4.0] - 2022-10-11

- if correlationId is empty fallback to generated uuid

[0.3.1]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v0.3.1
## [0.3.1] - 2022-07-08

- catch circular

[0.3.0]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v0.3.0
## [0.3.0] - 2022-02-23

- treat buffer as circular [Buffer]

[0.2.0]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v0.2.0
## [0.2.0] - 2022-02-10

- Add silent option (you might want to disable logging for testing purposes)

[0.1.1]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v0.1.1
## [0.1.1] - 2021-12-23

- Updated documentation

    [0.1.0]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v0.1.0
## [0.1.0] - 2021-12-17

- Updated documentation for release

[0.0.6]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v0.0.6
## [0.0.6] - 2021-12-16

- Bugfix: Don't reset the global log for loggers that don't override the global console

[0.0.5]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v0.0.5
## [0.0.5] - 2021-12-15

- re-publish with updated doc

[0.0.4]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v0.0.4
## [0.0.4] - 2021-12-15

- Support for logging circular objects
- override default = false

[0.0.3]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v0.0.3
## [0.0.3] - 2021-12-08

- Add request log formatting support

[0.0.2]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v0.0.2
## [0.0.2] - 2021-12-06

- Add 'baseproxy' to reset to and reset proxy on configchange
- Add option to return logger instead of overriding

[0.0.1]: https://github.com/digipolisantwerp/log_module_nodejs/tree/v0.0.1
## [0.0.1] - 2021-12-02

- Setup & format log to digipolis spec
