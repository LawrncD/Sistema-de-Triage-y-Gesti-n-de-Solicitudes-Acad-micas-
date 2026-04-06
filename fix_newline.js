const fs = require('fs');
const path = require('path');

function fix(dir) {
    if (!fs.existsSync(dir)) return;
    for (let f of fs.readdirSync(dir)) {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            fix(p);
        } else if (p.endsWith('.java')) {
            let c = fs.readFileSync(p, 'utf8');
            let original = c;
            
            // replace literal string \n with actual newline
            // in JS, literal backslash then n is "\\n"
            c = c.replace(/\\n/g, '\n');
            
            if (c !== original) {
                fs.writeFileSync(p, c, 'utf8');
                console.log('Fixed', p);
            }
        }
    }
}
fix('src');