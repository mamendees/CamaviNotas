import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  constructor(private http: HttpClient) { }

  getNotas(tia: String){
    this.http.post("http://localhost:5000/notas/getByTia",{"tiaAluno":tia}).subscribe((data: any) =>{
      console.table(JSON.parse(data));
      return data
    })
  }

  updateNota(notas:any){
    this.http.post("http://localhost:5000/notas/updateById",notas).subscribe((data: any) =>{
      console.log(data);
    })
  }

}
