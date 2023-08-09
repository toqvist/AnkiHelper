import { Sentence } from "@renderer/views/Analyze";
import FileHandler from "./fileHandler";

export interface WordFreq {
  word: string;
  frequency: number;
}

export default class Tools {

  static async wordFrequency(filePath: string, argumentWord: string): Promise<WordFreq[]> {
    try {
      const data: string = await FileHandler.readFile(filePath);
      const wordFrequencyMap: { [key: string]: number } = {};

      const words: string[] = data
        .toLowerCase()
        .replace(/[.,?!]/g, '')
        .split(/\s+/);

      words.forEach((word) => {
        if (word.includes(argumentWord.toLowerCase())) {
          wordFrequencyMap[word] = (wordFrequencyMap[word] || 0) + 1;
        }
      });

      const wordFrequencyList: WordFreq[] = Object.keys(wordFrequencyMap).map((word) => ({
        word,
        frequency: wordFrequencyMap[word],
      }));

      return this.sortByFrequency(wordFrequencyList);
    } catch (error) {
      throw new Error('Error reading or processing the file.');
    }
  }

  static sortByFrequency(wordFrequencyList: WordFreq[], descending = true): WordFreq[] {
    return wordFrequencyList.sort((a, b) => {
      if (descending) {
        return b.frequency - a.frequency; // Sort in descending order
      } else {
        return a.frequency - b.frequency; // Sort in ascending order
      }
    });
  }

  static sortAlphabetically(wordFrequencyList: WordFreq[], descending = true): WordFreq[] {
    return wordFrequencyList.sort((a, b) => {
      if (descending) {
        return b.word.localeCompare(a.word); // Sort in descending order (reverse alphabetical)
      } else {
        return a.word.localeCompare(b.word); // Sort in ascending order (alphabetical)
      }
    });
  }

  static async usedInSentences(filePath: string, argWord: string): Promise<Sentence[]> {
    try {
      const sentences = await FileHandler.readFileAsSentences(filePath, Infinity);

      const filteredSentences = sentences.filter(sentence => {
        return sentence.words.some(word => word.text.toLowerCase().includes(argWord.toLowerCase()));
      });

      return filteredSentences;
    } catch (error) {
      console.error('Error reading the file:', error);
      return [];
    }
  }


}