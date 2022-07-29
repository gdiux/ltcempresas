import { Pipe, PipeTransform } from '@angular/core';

import { environment } from "../../environments/environment"

const admin_url = environment.admin_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'products' | 'logo' | 'user'| 'preventives' | 'correctives' ): string {
    if (img) {            
        return `${admin_url}/uploads/${tipo}/${img}`;
    }else{
        return `${admin_url}/uploads/${tipo}/no-image`;
    }
  }

}
