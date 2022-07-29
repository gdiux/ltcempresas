import { User } from 'src/app/models/users.model';
import { Abonado } from '../models/abonado.model';

export interface LoadUsers {
    ok: boolean,
    users: Abonado[],
    total: number
}