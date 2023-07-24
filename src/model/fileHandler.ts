import fs from 'fs';

export default class FileHandler {

  //Writes string to file
  static async writeStringToFile(filePath: string, content: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(filePath);
      });
    });
  }

  //Reads a file as a string
  static async readFile(filePath: string) : Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    });
  }

  static async deleteFile(filePath: string) {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(filePath);
      });
    });
  }

 

  static async preview(filePath: string, numLines: number = 10): Promise<string[]> {
    try {
      const fileContent = await this.readFile(filePath);
      const lines = fileContent.split('\n');
      const linesToReturn = Math.min(numLines, lines.length); // Ensure we don't exceed the total lines
  
      const result = lines.slice(0, linesToReturn)
      console.log(result)
      return result;
    } catch (error: any) {
      throw new Error('Error reading the file: ' + error.message);
    }
  }
  
}