import fs from 'fs';
import fsExtra from 'fs-extra'
import path from 'path';
import { getRoutePaths } from './utils/getRoutePaths.js'
import { getFileContent } from "./utils/getFileContent.js";
import ComponentFormatter from "./utils/ComponentFormatter.js";
import { exec } from 'child_process';

export default class Compiler {
    static async getAllFilePaths(rootPath) {
        const allDirFiles = await fs.promises.readdir(rootPath);
        const removeNode_Modules = allDirFiles.filter(x => x !== 'index.js' && x !== 'build');
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
                await fsExtra.copy(x.path, FilePath)
                
            } catch(e) {
                console.log('erwe error: ', e);
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

    static async formatAllComponents(components) {
        for(let i = 0; i < components.length; i++) {
            const { path: componentPath } = components[i];
            const contentFile = await getFileContent(componentPath)
            const componentFormated = ComponentFormatter.formatComponent(contentFile)
            await fs.promises.writeFile(componentPath, componentFormated, "ascii")
        }
    }

    static async compile(rootProjectPath) {
        const allFilePaths = await this.getAllFilePaths(rootProjectPath)
        await this.createBuildDir(rootProjectPath)
        await this.copyAllFilesIntoBuildDir(rootProjectPath, allFilePaths)
        let myInterval = setInterval(async () => {
            const pageExist = await fsExtra.pathExists(path.join(rootProjectPath, 'build', 'pages'))
            if(pageExist) {
                const allComponents = await this.getAllComponentsToFormat(path.join(rootProjectPath, 'build'))
                const removeApis = allComponents.filter(x => x.url.indexOf('/api') === -1)
                await this.formatAllComponents(removeApis)
                exec(`node ${path.join(rootProjectPath, "build", "index.js")}`, (error, stdout, stderr) => {
                    console.log("^^^^^^^^^ STDOUT: ", stdout);
                    console.log("^^^^^^^^^ STDERR: ", stderr);
                    if(error!== null) {
                        console.log(error);
                    }
                    console.log('&&&&&&&&&& COMANDO EJECUTADO &&&&&&&&&&&&&');
                })
                clearInterval(myInterval)
            }
        }, 1000)
        
    }
}