const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const srcDir = path.join(projectRoot, 'src/main/java/co/edu/uniquindio/poo');
const testDir = path.join(projectRoot, 'src/test/java/co/edu/uniquindio/poo');
const dtoBasePath = path.join(srcDir, 'dto');

const dtoMoves = [
    { name: 'ApiResponseDTO.java', oldPath: 'response', newDomain: 'common' },
    { name: 'PageResponseDTO.java', oldPath: 'response', newDomain: 'common' },
    
    { name: 'UsuarioRequestDTO.java', oldPath: 'request', newDomain: 'usuario' },
    { name: 'UsuarioResponseDTO.java', oldPath: 'response', newDomain: 'usuario' },

    { name: 'HistorialResponseDTO.java', oldPath: 'response', newDomain: 'historial' },

    { name: 'SugerenciaIARequestDTO.java', oldPath: 'request', newDomain: 'ia' },
    { name: 'SugerenciaIAResponseDTO.java', oldPath: 'response', newDomain: 'ia' },

    { name: 'AsignacionRequestDTO.java', oldPath: 'request', newDomain: 'solicitud' },
    { name: 'CambioEstadoRequestDTO.java', oldPath: 'request', newDomain: 'solicitud' },
    { name: 'CierreRequestDTO.java', oldPath: 'request', newDomain: 'solicitud' },
    { name: 'ClasificacionRequestDTO.java', oldPath: 'request', newDomain: 'solicitud' },
    { name: 'PriorizacionRequestDTO.java', oldPath: 'request', newDomain: 'solicitud' },
    { name: 'SolicitudRequestDTO.java', oldPath: 'request', newDomain: 'solicitud' },
    { name: 'SolicitudResponseDTO.java', oldPath: 'response', newDomain: 'solicitud' }
];

function getAllJavaFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllJavaFiles(filePath, fileList);
        } else if (filePath.endsWith('.java')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

console.log('1. Moving DTO files...');
const importReplacements = [];

dtoMoves.forEach(dto => {
    const oldFullPath = path.join(dtoBasePath, dto.oldPath, dto.name);
    const newDirPath = path.join(dtoBasePath, dto.newDomain);
    const newFullPath = path.join(newDirPath, dto.name);

    if (!fs.existsSync(newDirPath)) {
        fs.mkdirSync(newDirPath, { recursive: true });
    }

    if (fs.existsSync(oldFullPath)) {
        fs.renameSync(oldFullPath, newFullPath);
        console.log(`Moved ${dto.name} from ${dto.oldPath} to ${dto.newDomain}`);
    } 

    const oldImport1 = `co.edu.uniquindio.poo.dto.${dto.oldPath}.${dto.name.replace('.java', '')}`;
    const newImport = `co.edu.uniquindio.poo.dto.${dto.newDomain}.${dto.name.replace('.java', '')}`;
    importReplacements.push({ old: oldImport1, new: newImport });
});

console.log('\\n2. Updating imports and packages...');
const allJavaFiles = [...getAllJavaFiles(srcDir), ...getAllJavaFiles(testDir)];
let updatedFiles = 0;

for (const file of allJavaFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    // Update package declarations for DTOs
    dtoMoves.forEach(dto => {
        if (file.includes(dto.name)) {
            const oldPackage = `package co.edu.uniquindio.poo.dto.${dto.oldPath};`;
            const newPackage = `package co.edu.uniquindio.poo.dto.${dto.newDomain};`;
            if (content.includes(oldPackage)) {
                content = content.replace(oldPackage, newPackage);
                hasChanges = true;
            }
        }
    });

    // Replace global imports
    importReplacements.forEach(repl => {
        const importOld1 = `import ${repl.old};`;
        const importNew = `import ${repl.new};`;
        if (content.includes(importOld1)) {
            content = content.replace(new RegExp(importOld1.replace(/\\./g, '\\\\.'), 'g'), importNew);
            hasChanges = true;
        }
    });

    // Also check wildcard imports
    if (content.includes('import co.edu.uniquindio.poo.dto.request.*;')) {
        content = content.replace('import co.edu.uniquindio.poo.dto.request.*;', 
            'import co.edu.uniquindio.poo.dto.common.*;\\nimport co.edu.uniquindio.poo.dto.solicitud.*;\\nimport co.edu.uniquindio.poo.dto.usuario.*;\\nimport co.edu.uniquindio.poo.dto.ia.*;');
        hasChanges = true;
    }
    if (content.includes('import co.edu.uniquindio.poo.dto.response.*;')) {
        content = content.replace('import co.edu.uniquindio.poo.dto.response.*;', 
            'import co.edu.uniquindio.poo.dto.common.*;\\nimport co.edu.uniquindio.poo.dto.solicitud.*;\\nimport co.edu.uniquindio.poo.dto.usuario.*;\\nimport co.edu.uniquindio.poo.dto.ia.*;\\nimport co.edu.uniquindio.poo.dto.historial.*;');
        hasChanges = true;
    }

    if (hasChanges) {
        fs.writeFileSync(file, content, 'utf8');
        updatedFiles++;
    }
}

console.log(`Updated ${updatedFiles} files with new packages/imports.`);

// Cleanup empty folders
['request', 'response'].forEach(oldPath => {
    const oldDirPath = path.join(dtoBasePath, oldPath);
    if (fs.existsSync(oldDirPath)) {
        const remaining = fs.readdirSync(oldDirPath);
        if (remaining.length === 0) {
            fs.rmdirSync(oldDirPath);
            console.log(`Removed empty directory: dto/${oldPath}`);
        }
    }
});