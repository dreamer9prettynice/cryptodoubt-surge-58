import { compileFunc } from '@ton-community/func-js';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const source = fs.readFileSync(
        path.resolve(__dirname, '../contracts/Betting.fc'),
        'utf8'
    );

    const result = await compileFunc({
        sources: {
            'Betting.fc': source
        },
        targets: ['Betting.fc']
    });

    if (result.status === 'error') {
        console.error('Error compiling contract:', result.message);
        process.exit(1);
    }

    fs.writeFileSync(
        path.resolve(__dirname, '../build/betting.cell'),
        Buffer.from(result.codeBoc, 'base64')
    );

    console.log('Contract compiled successfully for mainnet deployment');
}

main().catch(console.error);