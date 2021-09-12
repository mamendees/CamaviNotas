import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(private http: HttpClient) { }

  getMateriasPorTiaProfessor(tia: String): any{
    return this.http.post("http://localhost:5000/professores/materias", {"tiaProfessor": tia});
  }
}
