
import fetch from 'cross-fetch';

export class Translator {

    static async translate(word: string, targetLang: string): Promise<string[]> {
        try {
            const googleTranslateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
                word
            )}`;

            const response = await fetch(googleTranslateUrl);
            const result = await response.json();

            const rawTranslations: any[] = result[0];
            const translations: string[] = rawTranslations
                .filter((value) => value && value[0] !== word)
                .map((value) => value[0]);
           
            return translations;
        } catch (error) {
            console.error('Translation error:', error);
            return ['Translation failed'];
        }
    }

    static async detectLanguage(text: string): Promise<string> {
        try {
            const googleTranslateUrl = `https://translation.googleapis.com/language/translate/v2/detect?key=${process.env.GOOGLE_KEY}&q=${encodeURIComponent(
                text
            )}`;

            const response = await fetch(googleTranslateUrl);
            const result = await response.json();

            const detectedLanguage: string = result.data.detections[0][0].language;

            return detectedLanguage;
        } catch (error) {
            console.error('Language detection error:', error);
            return 'Detection failed';
        }
    }
}