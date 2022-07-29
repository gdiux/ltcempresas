export class Product{

    constructor(
        public code: string,
        public serial: string,
        public estado?: 'Disponible' | 'Mantenimiento' | 'Instalada',
        public brand?: string,
        public model?: string,
        public year?: number,
        public status?: boolean,
        public client?: any,
        public next?: Date,
        public date?: Date,
        public pid?: string,
        public cliente?: boolean,
        public img?: string,
        public preventivo?: boolean,
        public frecuencia?: number
    ) {}

}