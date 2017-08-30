// The root folder for this script's context is the folder containing package.json
const sourceFolderPath = "./src";
const outputPath = "./zips/";
const projectName = "GithubMarkdownLivePreview";
// Get the version number from the manifest
const version = require("../src/manifest.json").version;
let outputFileName = `${outputPath}${projectName}-${version}.zip`;
const pathsAndFilenames = require("./pathsAndFilenames.json");

const fse = require('fs-extra');
const zipFolder = require('zip-folder');
const execSync = require("child_process").execSync;

// If that filename already exists, add the timestamp to the output filename
if (fse.existsSync(outputFileName)) {
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    const time = new Date().toLocaleTimeString().replace(/\:/g, '-');
    outputFileName =  `${outputPath}${projectName}-${version} - ${date}${time}.zip`;
}

// Check if Showdown is copied
if (!fse.existsSync(`${pathsAndFilenames.showdownPath}/${pathsAndFilenames.showdownFileName}`)) {
    // Check if Showdown is installed
    if (!fse.existsSync(`${pathsAndFilenames.showdownNodeModulesPath}/dist/showdown.min.js`)) {
        // If not, install it
        execSync("npm install --only=dev");
    }

    // Run copy-showdown.js
    execSync("npm run copy-showdown");
}

// Zip it up
zipFolder(sourceFolderPath, outputFileName, function(err) {
    if (err) {
        console.log('Error: ', err);
    } else {
        console.log("Zip successfully generated: " + outputFileName.slice(2));
    }
});