import spellchecker from 'spellchecker'

export const extractTextFromDocx = (buffer: any) => {
  const text = buffer.toString('utf-8'); // Read text directly
  return text.replace(/[\r\n]+/g, ' '); // Remove extra line breaks
}

// Spell check and correct spelling errors
export const  correctSpelling = (text: string) => {
  const words = text.split(' ');
  const correctedWords = words.map(word => {
      if (spellchecker.isMisspelled(word)) {
          const suggestions = spellchecker.getCorrectionsForMisspelling(word);
          return suggestions.length > 0 ? suggestions[0] : word; // Replace with the first suggestion
      }
      return word;
  });

  return correctedWords.join(' '); // Join corrected words into a sentence
}