#!/usr/bin/env node

import fetch from 'node-fetch';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { promises as fs } from 'fs';
import path from 'path';

const parseGitHubUrl = (url) => {
	const regex = /^https:\/\/github.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)\/(.+)$/;
	const matches = url.match(regex);
	if (!matches) {
		throw new Error('URL invalid');
	}
	return { owner: matches[1], repo: matches[2], branch: matches[3], path: matches[4] };
};

const downloadFile = async (url, outputPath) => {
	const response = await fetch(url);
	const data = await response.buffer();
	await fs.mkdir(path.dirname(outputPath), { recursive: true });
	await fs.writeFile(outputPath, data);
};

const downloadDirectory = async ({ owner, repo, branch, dirPath }, localPath) => {
	const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}?ref=${branch}`;
	const response = await fetch(apiUrl);
	const contents = await response.json();

	await fs.mkdir(localPath, { recursive: true });

	for (const content of contents) {
		const contentPath = path.join(localPath, content.name);
		if (content.type === 'dir') {
			await downloadDirectory({ owner, repo, branch, dirPath: content.path }, contentPath);
		} else if (content.type === 'file') {
			console.log(`Downloading ${content.download_url} to ${contentPath}`);
			await downloadFile(content.download_url, contentPath);
		}
	}
};

const argv = yargs(hideBin(process.argv))
	.usage('Usage: $0 <GitHub URL> [--output <path>]')
	.option('output', {
		alias: 'o',
		describe: 'Specify the output directory',
		type: 'string',
		default: '.'
	})
	.demandCommand(1, 'You need to provide a GitHub URL to download the directory.')
	.parse();

const main = async () => {
	const url = argv._[0];
	const { owner, repo, branch, path: dirPath } = parseGitHubUrl(url);
	const outputPath = argv.output ? path.resolve(argv.output, dirPath.split('/').pop()) : dirPath.split('/').pop();
	await downloadDirectory({ owner, repo, branch, dirPath }, outputPath);
};

main().catch((error) => console.error(error.message));