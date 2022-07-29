import { Client } from "./clients.model";

export class Abonado {

    constructor(
        public usuario: string,
        public name: string,
        public aid: string,
        public password?: string,
        public clients?: Client[],
        public valid?: boolean,
        public status?: boolean,
        public fecha?: Date,
    ){}

}