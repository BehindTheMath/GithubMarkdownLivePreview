const pathsAndFilenames = require("./pathsAndFilenames.json");

const fse = require('fs-extra');

// Check if the Showdown path exists already, and if not, create it
fse.ensureDirSync(pathsAndFilenames.showdownPath);

// Check if we have Showdown already
if (!fse.existsSync(`${pathsAndFilenames.showdownPath}/${pathsAndFilenames.showdownFileName}`)) {
    // Copy Showdown from node_modules
    fse.copySync(`${pathsAndFilenames.showdownNodeModulesPath}/dist/showdown.min.js`, `${pathsAndFilenames.showdownPath}/${pathsAndFilenames.showdownFileName}`)
}

// Check if we have the Showdown licence already
if (!fse.existsSync(`${pathsAndFilenames.showdownPath}/${pathsAndFilenames.showdownLicenseFileName}`)) {
    // Copy the Showdown licence from node_modules
    fse.copySync(`${pathsAndFilenames.showdownNodeModulesPath}/license.txt`, `${pathsAndFilenames.showdownPath}/${pathsAndFilenames.showdownLicenseFileName}`)
}
