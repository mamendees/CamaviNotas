import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  constructor(private http: HttpClient) { }

  getNotas(tia: String): any{
    return this.http.post("http://localhost:5000/notas/getByTia", {"tiaAluno":tia});
  }

  updateNota(notas: any){
    return this.http.post("http://localhost:5000/notas/updateById", notas);
  }

  getNotasPorMaterias(idMateria: string){
    return this.http.post("http://localhost:5000//professores/notasMaterias", {"materiaId": idMateria});
  }

}
