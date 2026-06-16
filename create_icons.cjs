const fs = require('fs');
const path = require('path');

// 1x1 transparent PNG base64
const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const buffer = Buffer.from(base64Data, 'base64');

const dir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'icon16.png'), buffer);
fs.writeFileSync(path.join(dir, 'icon48.png'), buffer);
fs.writeFileSync(path.join(dir, 'icon128.png'), buffer);

console.log("Dummy icons generated successfully!");
