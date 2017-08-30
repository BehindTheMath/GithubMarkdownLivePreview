const pathsAndFileNames = require("./pathsAndFileNames.json");

const fse = require('fs-extra');

// Check if the Showdown path exists already, and if not, create it
fse.ensureDirSync(pathsAndFileNames.showdownPath);

// Check if we have Showdown already
if (!fse.existsSync(`${pathsAndFileNames.showdownPath}/${pathsAndFileNames.showdownFileName}`)) {
    // Copy Showdown from node_modules
    fse.copySync(`${pathsAndFileNames.showdownNodeModulesPath}/dist/${pathsAndFileNames.showdownFileName}`,
        `${pathsAndFileNames.showdownPath}/${pathsAndFileNames.showdownFileName}`)
}

// Check if we have the Showdown licence already
if (!fse.existsSync(`${pathsAndFileNames.showdownPath}/${pathsAndFileNames.showdownLicenseFileName}`)) {
    // Copy the Showdown licence from node_modules
    fse.copySync(`${pathsAndFileNames.showdownNodeModulesPath}/${pathsAndFileNames.showdownLicenseFileName}`,
        `${pathsAndFileNames.showdownPath}/${pathsAndFileNames.showdownLicenseFileName}`)
}

// Check if the Sanitize-HTML path exists already, and if not, create it
fse.ensureDirSync(pathsAndFileNames.sanitizeHtmlPath);

// Check if we have Sanitize-HTML already
if (!fse.existsSync(`${pathsAndFileNames.sanitizeHtmlPath}/${pathsAndFileNames.sanitizeHtmlFileName}`)) {
    // Copy Showdown from node_modules
    fse.copySync(`${pathsAndFileNames.sanitizeHtmlNodeModulesPath}/dist/${pathsAndFileNames.sanitizeHtmlFileName}`,
        `${pathsAndFileNames.sanitizeHtmlPath}/${pathsAndFileNames.sanitizeHtmlFileName}`)
}

// Check if we have the Sanitize-HTML licence already
if (!fse.existsSync(`${pathsAndFileNames.sanitizeHtmlPath}/${pathsAndFileNames.sanitizeHtmlLicenseFileName}`)) {
    // Copy the Sanitize-HTML licence from node_modules
    fse.copySync(`${pathsAndFileNames.sanitizeHtmlNodeModulesPath}/${pathsAndFileNames.sanitizeHtmlLicenseFileName}`,
        `${pathsAndFileNames.sanitizeHtmlPath}/${pathsAndFileNames.sanitizeHtmlLicenseFileName}`)
}
