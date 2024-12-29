import { compileFunc } from '@ton-community/func-js';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    // Read the source file
    const source = fs.readFileSync(
        path.resolve(__dirname, '../contracts/Betting.fc'),
        'utf8'
    );

    // Compile the contract
    const result = await compileFunc({
        sources: {
            'Betting.fc': source
        },
        entryPoints: ['Betting.fc']
    });

    if (result.status === 'error') {
        console.error('Error compiling contract:', result.message);
        process.exit(1);
    }

    // Write the compiled contract to a file
    fs.writeFileSync(
        path.resolve(__dirname, '../build/betting.cell'),
        Buffer.from(result.codeBoc, 'base64')
    );

    console.log('Contract compiled successfully');
}

main().catch(console.error);