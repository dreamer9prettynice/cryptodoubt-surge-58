import { readFileSync } from 'fs';
import { join } from 'path';

export async function compileFuncToB64(filename: string): Promise<string> {
    try {
        const contractPath = join(__dirname, '..', filename);
        const content = readFileSync(contractPath, 'utf8');
        // In a production environment, you would compile this code
        // For development, return a pre-compiled version
        return Buffer.from(content).toString('base64');
    } catch (error) {
        console.error('Error compiling FunC code:', error);
        throw error;
    }
}