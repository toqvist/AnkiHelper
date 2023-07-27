import fs from 'fs'
import * as path from 'path';
import { app, dialog } from 'electron';
import { v1 as uuidv1 } from 'uuid';

export default class FileHandler {

  //Writes string to file
  static async writeStringToFile(filePath: string, content: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
          reject(err)
          return
        }

        resolve(filePath)
      })
    })
  }

  //Reads a file as a string
  static async readFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err)
          return
        }

        resolve(data)
      })
    })
  }

  static async deleteFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err)
          return
        }

        resolve(filePath)
      })
    })
  }

  static async previewFile(filePath: string, numLines = 10): Promise<string[]> {
    try {
      const fileContent = await this.readFile(filePath)
      const lines = fileContent.split('\n')
      const linesToReturn = Math.min(numLines, lines.length) // Ensure we don't exceed the total lines

      const result = lines.slice(0, linesToReturn)
      return result
    } catch (error: any) {
      throw new Error('Error reading the file: ' + error.message)
    }
  }

  static async saveFileTemp(filePath: string, content: string): Promise<string> {
    const scriptDir = app.getAppPath();

    const fileName = path.basename(filePath);
    const fileExtension = path.extname(fileName);
    const fileNameWithoutExtension = path.basename(fileName, fileExtension);

    const uuid = uuidv1().replace(/-/g, '');

    const newFileName = `${fileNameWithoutExtension}-${uuid}${fileExtension}`;
    const targetPath = path.join('temp', scriptDir, newFileName);
    
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }

    FileHandler.writeStringToFile(targetPath, content)
    return targetPath
    //TODO Clean up temp file on exit
  }
}

