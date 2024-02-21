# GitHub Directory Downloader

This CLI tool allows for the quick downloading of an entire GitHub directory's contents directly to your local machine.

## Installation

To install this tool, run:

```bash
npm install -g d-github
```

## Usage

To download a directory from GitHub, execute:

```bash
d-github <GitHub URL> [--output <path>]
```

- `<GitHub URL>`: The full URL of the GitHub directory you wish to download.
- `--output`, `-o`: Specify the output directory where the downloaded content will be saved. If not specified, content will be saved in the current directory.

### Examples

Downloading a directory to the current directory:

```bash
d-github https://github.com/username/repo/tree/branch/path/to/directory
```

Specify an output directory:

```bash
d-github https://github.com/username/repo/tree/branch/path/to/directory --output ./myDirectory
```

