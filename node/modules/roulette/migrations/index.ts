import path from 'path';
import fs from 'fs';

const updatesPath = path.join(__dirname, './sql');
export const migrations = fs
    .readdirSync(updatesPath)
    .map(file => path.join(updatesPath, file));
