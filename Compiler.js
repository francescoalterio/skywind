import fs from 'fs';
import path from 'path';

export default class Compiler {
    static async getAllFilePaths(rootPath) {
        const allDirFiles = await fs.promises.readdir(rootPath);
        const removeNode_Modules = allDirFiles.filter(x => x !== 'node_modules');
        const allPaths = removeNode_Modules.map(x => {
            const filePath = {
                path: path.join(rootPath, x),
                name: x
            }
            return filePath
        })
        
        return allPaths
    }

    static async createBuildDir(path) {
        if(!fs.existsSync(path + '/build/')) {
            await fs.promises.mkdir(path + '/build');
        }
    }

    static async copyAllFilesIntoBuildDir(rootPath, files) {
        files.forEach(async x => {
            try {
                
                const FilePath = path.join(rootPath, "build", x.name)
                await fs.promises.access(path.join(rootPath, 'build'), fs.constants.W_OK);
                await fs.promises.copy(x.path, FilePath)
                console.log("erwe");
            } catch(e) {
                console.log(e);
            }
        })
    }

    static async compile(rootProjectPath) {
        const allFilePaths = await this.getAllFilePaths(rootProjectPath)
        console.log("erwe");
        await this.createBuildDir(rootProjectPath)
        await this.copyAllFilesIntoBuildDir(rootProjectPath, allFilePaths)
    }
}