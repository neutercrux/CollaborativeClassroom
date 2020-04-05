import { Note } from './note';

export class FileNoteMap { 
    public fileName: string;
    public notes: Note[];
    constructor(fileName: string) {
        this.fileName = fileName;
        this.notes = [];
    }
}