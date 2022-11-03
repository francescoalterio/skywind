import fs from 'fs';
import fsExtra from 'fs-extra'
import path from 'path';
import { getRoutePaths } from './utils/getRoutePaths.js'
import { getFileContent } from "./utils/getFileContent.js";

export default class Compiler {
    static async getAllFilePaths(rootPath) {
        const allDirFiles = await fs.promises.readdir(rootPath);
        const removeNode_Modules = allDirFiles.filter(x => x !== 'node_modules' && x !== 'build');
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
                await fsExtra.copy(x.path, FilePath)
            } catch(e) {
                console.log(e);
            }
        })
    }

    static async getAllComponentsToFormat(dirPath) {
        const allPages = await getRoutePaths(path.join(dirPath, 'pages'))
        const AllPageFiles = allPages.filter(x => x.type === 'file')
        const allComponents = await getRoutePaths(path.join(dirPath, 'components'))
        const AllComponentFiles = allComponents.filter(x => x.type === 'file')
        return [...AllPageFiles,...AllComponentFiles]
    }

    static async compile(rootProjectPath) {
        const allFilePaths = await this.getAllFilePaths(rootProjectPath)
        await this.createBuildDir(rootProjectPath)
        await this.copyAllFilesIntoBuildDir(rootProjectPath, allFilePaths)
        const allComponents = await this.getAllComponentsToFormat(path.join(rootProjectPath, 'build'))
        const fileContent = await getFileContent(allComponents[0].path)
        console.log(fileContent);
    }
}