const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/main/java/co/edu/uniquindio/poo');
const testDir = path.join(__dirname, 'src/test/java/co/edu/uniquindio/poo');

const dtoMap = {
    // COMMON
    'ApiResponseDTO.java': 'common',
    'PageResponseDTO.java': 'common',
    
    // USUARIO
    'UsuarioRequestDTO.java': 'usuario',
    'UsuarioResponseDTO.java': 'usuario',

    // HISTORIAL
    'HistorialResponseDTO.java': 'historial',

    // IA
    'SugerenciaIARequestDTO.java': 'ia',
    'SugerenciaIAResponseDTO.java': 'ia',

    // SOLICITUD
    'AsignacionRequestDTO.java': 'solicitud',
    'CambioEstadoRequestDTO.java': 'solicitud',
    'CierreRequestDTO.java': 'solicitud',
    'ClasificacionRequestDTO.java': 'solicitud',
    'PriorizacionRequestDTO.java': 'solicitud',
    'SolicitudRequestDTO.java': 'solicitud',
    'SolicitudResponseDTO.java': 'solicitud'
};

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

const allJavaFiles = [...getAllJavaFiles(srcDir), ...getAllJavaFiles(testDir)];

console.log(`Found ${allJavaFiles.length} Java files.`);
