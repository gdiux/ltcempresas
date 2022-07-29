import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(  private http: HttpClient) { }

   /** ================================================================
   *   GET TOKEN
  ==================================================================== */
  get token():string {
    return localStorage.getItem('token') || '';
  }

  /** ================================================================
   *   GET HEADERS
  ==================================================================== */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  /** ================================================================
   *   UPDATE IMAGES
  ==================================================================== */
  async updateImage(
    archivo: File,
    type: 'products' | 'logo' | 'user' | 'preventives' | 'correctives',
    id: string,
    desc: 'imgBef' | 'imgAft' | 'video' | 'none' = 'none'
  ){

    try {
      
      const url = `${base_url}/uploads/${type}/${id}?desc=${desc}`;

      const formData = new FormData();
      formData.append('image', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers:{
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      if (data.ok) {
        return data;
      }else{
        return false;

      }      
      
    } catch (error) {
      console.log(error);      
      return false;
    }

  }

  /** ================================================================
   *   DELETE IMAGES
  ==================================================================== */
  deleteImg(
    type: 'products' | 'logo' | 'user' | 'preventives' | 'correctives',
    id: string,
    desc: 'imgBef' | 'imgAft' | 'video' | 'img' = 'img',
    img: string
  ){

    return this.http.delete(`${base_url}/uploads/delete/${type}/${id}/${desc}/${img}`, this.headers);

  }



  // FIN DE LA CLASE

}
