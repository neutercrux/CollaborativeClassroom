export class File { 
    constructor(
        public name: string,
        public data: string,
        public language: string,
        ) { }    
  }

export const enum FileStatus {
    CREATE_FILE,
    UPDATE_FILE,
    UPDATE_FILE_DATA,
    DELETE_FILE,
}