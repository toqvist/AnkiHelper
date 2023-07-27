import FileHandler from "./fileHandler";

export interface WordFreq {
  word: string;
  frequency: number;
}

export default class Tools {

  static async wordFrequency(filePath: string, argumentWord: string): Promise<WordFreq[]> {
    try {
      const data: string = await FileHandler.readFile(filePath)
      const sentences: string[] = data.split(/[\.\?!]+\n*/);

      const wordFrequencyMap: { [key: string]: number } = {};

      sentences.forEach((sentence) => {
        const words: string[] = sentence.trim().split(' ');
        words.forEach((word) => {
          const cleanedWord = word.toLowerCase().replace(/[.,?!]/g, '');
          if (cleanedWord.includes(argumentWord.toLowerCase())) {
            wordFrequencyMap[cleanedWord] = (wordFrequencyMap[cleanedWord] || 0) + 1;
          }
        });
      });

      const outputArray: WordFreq[] = Object.entries(wordFrequencyMap).map(([word, frequency]) => ({
        word,
        frequency,
      }));

      return outputArray;
    } catch (error) {
      throw new Error('Error reading input file: ' + error);
    }
  }
}