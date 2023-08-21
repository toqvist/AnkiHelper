import fs from 'fs'
import * as path from 'path'
import { v1 as uuidv1 } from 'uuid'
import { Sentence, Word } from '@renderer/views/Analyze'

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
          return ''
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
    } catch (error: unknown) {
      throw new Error('Error reading the file: ' + error.message)
      return []
    }
  }

  static async readFileAsSentences(filePath: string, numLines: number): Promise<Sentence[]> {
    try {
      const fileContent = await this.readFile(filePath)
      const lines = fileContent.split(/\r?\n/).slice(0, numLines)

      const sentences: Sentence[] = []

      const wordPattern = /[\p{L}\p{N}'-]+/gu
      const punctuationPattern = /[^\p{L}\p{N}\s'-]+/gu

      for (const sentenceText of lines) {
        const wordsAndPunctuation = sentenceText.match(
          new RegExp(`${wordPattern.source}|\\s|${punctuationPattern.source}`, 'gu')
        )

        if (wordsAndPunctuation?.length) {
          const words: Word[] = wordsAndPunctuation.map((item) => ({
            text: item,
            clozed: false,
            isPunctuation: item.trim() === '' || punctuationPattern.test(item),
            translations: [],
            hint: ''
          }))
          sentences.push({ words })
        }
      }

      return sentences
    } catch (error) {
      // Handle any potential errors here
      console.error(error)
      return []
    }
  }

  static async saveFileTemp(filePath: string, content: string): Promise<string> {
    const binaryDirectory = __dirname
    const tempFolderName = 'temp'
    const tempFolderPath = path.join(binaryDirectory, tempFolderName)

    if (!fs.existsSync(tempFolderPath)) {
      fs.mkdirSync(tempFolderPath, { recursive: true })
    }
    let targetPath: string

    if (filePath === '') {
      const uuid: string = uuidv1()
      const newFileName = `${uuid}.txt`
      targetPath = path.join(tempFolderPath, newFileName)
    } else {
      const fileName = path.basename(filePath)
      const fileExtension = path.extname(fileName)
      const fileNameWithoutExtension = path.basename(fileName, fileExtension)

      const uuid = uuidv1().replace(/-/g, '')

      const newFileName = `${fileNameWithoutExtension}-${uuid}${fileExtension}`
      targetPath = path.join(tempFolderPath, newFileName)
    }

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath)
    }

    console.log('wrote file to: ' + targetPath)
    await FileHandler.writeStringToFile(targetPath, content)
    return targetPath
  }

  static cleanUpTempFolder() {
    const tempFolderName = 'temp'
    const tempFolderPath = path.join(__dirname, tempFolderName)

    if (fs.existsSync(tempFolderPath)) {
      fs.readdirSync(tempFolderPath).forEach((file) => {
        const filePath = path.join(tempFolderPath, file)
        fs.unlinkSync(filePath)
      })

      fs.rmdirSync(tempFolderPath)
    }
  }
}
