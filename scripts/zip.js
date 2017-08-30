// The root folder for this script's context is the folder containing package.json
const sourceFolderPath = "./src";
const outputPath = "./zips/";
const projectName = "GithubMarkdownLivePreview";
// Get the version number from the manifest
const version = require("../src/manifest.json").version;
let outputFileName = `${outputPath}${projectName}-${version}.zip`;
const pathsAndFileNames = require("./pathsAndFileNames.json");

const fse = require('fs-extra');
const zipFolder = require('zip-folder');
const execSync = require("child_process").execSync;

// If that filename already exists, add the timestamp to the output filename
if (fse.existsSync(outputFileName)) {
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    const time = new Date().toLocaleTimeString().replace(/\:/g, '-');
    outputFileName =  `${outputPath}${projectName}-${version} - ${date}${time}.zip`;
}

// Check if Showdown and Sanitize-HTML are copied
if (!(fse.existsSync(`${pathsAndFileNames.showdownPath}/${pathsAndFileNames.showdownFileName}`) ||
        fse.existsSync(`${pathsAndFileNames.showdownPath}/${pathsAndFileNames.showdownLicenseFileName}`) ||
        fse.existsSync(`${pathsAndFileNames.sanitizeHtmlPath}/${pathsAndFileNames.sanitizeHtmlFileName}`) ||
        fse.existsSync(`${pathsAndFileNames.sanitizeHtmlPath}/${pathsAndFileNames.sanitizeHtmlLicenseFileName}`))) {
    // Run setup.js
    execSync("npm run setup");
}

// Zip it up
zipFolder(sourceFolderPath, outputFileName, function(err) {
    if (err) {
        console.log('Error: ', err);
    } else {
        console.log("Zip successfully generated: " + outputFileName.slice(2));
    }
});