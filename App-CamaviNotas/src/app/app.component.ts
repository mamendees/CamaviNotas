import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'App-CamaviNotas';
  usuario: usuario = usuario.professor;

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    console.log(this._activatedRoute.url)
    console.log(this._router.url)
   }

  botaoProfessor(){
    this._router.navigate(['/home']);
    this.usuario = usuario.professor;
  }
  botaoAluno(){
    this._router.navigate(['/home']);
    this.usuario = usuario.aluno;
  }
}

export enum usuario{
  aluno = "Aluno",
  professor = "Professor"
}
