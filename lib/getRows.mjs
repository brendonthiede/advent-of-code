import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

export default function getRows(fileShortName) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = `${__dirname}/../${fileShortName}`

    return readFileSync(filePath, 'utf8').split(/\r?\n/)
}
