
import fetch from 'cross-fetch';

export class Translator {

    static async translate(word: string, targetLang: string): Promise<string[]> {
        try {
            const googleTranslateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
                word
            )}`;

            const response = await fetch(googleTranslateUrl);
            const result = await response.json();

            console.log(result);
            console.log(result[0]);

            const rawTranslations: any[] = result[0][0];
            rawTranslations.pop()
            const translations: string[] = rawTranslations.filter((value) => value !== null);

            return translations;
        } catch (error) {
            console.error('Translation error:', error);
            return ['Translation failed'];
        }
    }
}