export default class FileProcessor {

    static trimSRTMetadata(content: string) {

        const lines = content.split('\n');
        const filteredLines = lines.filter(line => !/^\d/.test(line));

        const trimmedContent = filteredLines.join('\n').trim();
        return trimmedContent;
    }
}