import fs from 'fs'

function extractSentencesWithArgumentWord(inputFilePath, argumentWord): void {
  fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading input file:', err)
      return
    }

    const sentences = data.split(/[\.\?!]+\n*/) 

    const wordFrequencyMap = {}

    sentences.forEach((sentence) => {
      const words = sentence.trim().split(' ')
      words.forEach((word) => {
        const cleanedWord = word.toLowerCase().replace(/[.,?!]/g, '')
        if (cleanedWord.includes(argumentWord.toLowerCase())) {
          wordFrequencyMap[cleanedWord] = (wordFrequencyMap[cleanedWord] || 0) + 1
        }
      })
    })

    const outputFilePath = inputFilePath.replace('.txt', '_example.txt')

    const outputArray = Object.entries(wordFrequencyMap).map(([word, frequency]) => ({
      word,
      frequency
    }))

    fs.writeFile(outputFilePath, JSON.stringify(outputArray, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing output file:', err)
        return
      }

      console.log('Word frequencies have been written to', outputFilePath)
    })
  })
}
