import fs from 'fs'
import * as path from 'path';
import { app, dialog } from 'electron';
import { v1 as uuidv1, uuid } from 'uuid';
import { Sentence, Word } from '@renderer/views/Analyze';

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

  static async previewFile(filePath: string, numLines: number): Promise<string[]> {
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

  static async readFileAsSentences(filePath: string, numLines: number): Promise<Sentence[]> {
    try {
      const fileContent = await this.readFile(filePath);
      const lines = fileContent.split('\n');
      const linesToReturn = Math.min(numLines, lines.length);
  
      const sentences: Sentence[] = [];
  
      // Unicode character classes for words and punctuation
      const wordPattern = /[\p{L}\p{N}'-]+/gu;
      const punctuationPattern = /[^\p{L}\p{N}\s'-]+/gu;
  
      for (let i = 0; i < linesToReturn; i++) {
        const sentenceText = lines[i];
        const wordsAndPunctuation = sentenceText.match(
          new RegExp(`${wordPattern.source}|\\s|${punctuationPattern.source}`, 'gu')
        );
  
        // Check if the line contains valid words before adding to the result
        if (wordsAndPunctuation && wordsAndPunctuation.some(item => wordPattern.test(item))) {
          const words: Word[] = wordsAndPunctuation.map((item) => {
            const isPunctuation = punctuationPattern.test(item);
            return { text: item, clozed: false, isPunctuation, translations: [], hint: '' };
          });
  
          const sentence: Sentence = { words };
          sentences.push(sentence);
        }
      }
  
      return sentences;
    } catch (error: any) {
      throw new Error('Error reading the file: ' + error.message);
    }
  }
  



  static async saveFileTemp(filePath: string, content: string): Promise<string> {

    const binaryDirectory = __dirname;
    const tempFolderName = 'temp';
    const tempFolderPath = path.join(binaryDirectory, tempFolderName);

    if (!fs.existsSync(tempFolderPath)) {
      fs.mkdirSync(tempFolderPath, { recursive: true });
    }
    let targetPath: string;

    if (filePath === '') {
      const uuid: string = uuidv1();
      const newFileName: string = `${uuid}.txt`;
      targetPath = path.join(tempFolderPath, newFileName);
    } else {
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(fileName);
      const fileNameWithoutExtension = path.basename(fileName, fileExtension);

      const uuid = uuidv1().replace(/-/g, '');

      const newFileName = `${fileNameWithoutExtension}-${uuid}${fileExtension}`;
      targetPath = path.join(tempFolderPath, newFileName);
    }

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }

    await FileHandler.writeStringToFile(targetPath, content);
    return targetPath;

  }

  static cleanUpTempFolder() {
    const tempFolderName = 'temp';
    const tempFolderPath = path.join(__dirname, tempFolderName);

    if (fs.existsSync(tempFolderPath)) {
      fs.readdirSync(tempFolderPath).forEach(file => {
        const filePath = path.join(tempFolderPath, file);
        fs.unlinkSync(filePath);
      });

      fs.rmdirSync(tempFolderPath);
    }
  }
}

