const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    const configJsPath = path.join(context.opts.projectRoot, 'www/js/anyline.license.js');
    const licenseKey = process.env.ANYLINE_MOBILE_SDK_LICENSE_KEY;

    // If the license file already exists, just show a warning and continue
    if (fs.existsSync(configJsPath)) {
        console.warn('anyline.license.js already exists. Skipping license key setup.');
        return;
    }

    // If the file doesn't exist, we need ANYLINE_MOBILE_SDK_LICENSE_KEY
    if (!licenseKey) {
        console.error('Error: ANYLINE_MOBILE_SDK_LICENSE_KEY environment variable is not set');
        console.error('');
        console.error('Please set it in your shell profile (~/.zshrc or ~/.bashrc):');
        console.error('  export ANYLINE_MOBILE_SDK_LICENSE_KEY="your-license-key-here"');
        console.error('');
        console.error('Then reload your shell or run: source ~/.zshrc');
        process.exit(1);
    }

    // Create the license file with the provided key
    const initialContent = `
if (anyline === undefined) {
    var anyline = {};
}

anyline.license = {
    key: "${licenseKey}"
}
`;
    fs.writeFileSync(configJsPath, initialContent.trim(), 'utf8');
    console.log('Created anyline.license.js with initial content');
};

