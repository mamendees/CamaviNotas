import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface NotasViewModel {
  nomeAluno: string;
  tiaAluno: string;
  notaA: number;
  notaB: number;
  notaC: number;
  notaD: number;
  notaFinal: number;
}

export interface MateriasViewModel{
  nomeMateria: string;
  idMateria : string;
  notaAlunos: NotasViewModel[]
}

let ELEMENT_DATA: NotasViewModel[] = [
  { nomeAluno: "Matheus",  tiaAluno: '31944507', notaA: 1, notaB: 2, notaC: 3, notaD: 4, notaFinal: 10},
  { nomeAluno: "Vinicius", tiaAluno: '31944507', notaA: 5, notaB: 6, notaC: 7, notaD: 8, notaFinal: 10},
];

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nomeAluno', 'tiaAluno', 'notaA', 'notaB', 'notaC', 'notaD', 'notaFinal'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) public sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  esconderMostrarMaterias: esconderMostrarMaterias = esconderMostrarMaterias.mostrar;

  selecaoDeMaterias: string[] = ['Etica', 'Calculo1', 'Empreendedorismo'];
  materiasModel: MateriasViewModel[] = [
    {nomeMateria: "Etica", idMateria: "1", notaAlunos: [{nomeAluno: "Carolina",  tiaAluno: '31944507', notaA: 1, notaB: 2, notaC: 3, notaD: 4, notaFinal: 10}]},
    {nomeMateria: "Calculo1", idMateria: "1", notaAlunos: [{nomeAluno: "Matheus",  tiaAluno: '31944507', notaA: 1, notaB: 2, notaC: 3, notaD: 4, notaFinal: 10}]},
    {nomeMateria: "Empreendedorismo", idMateria: "1", notaAlunos: [{nomeAluno: "Vinicius",  tiaAluno: '31944507', notaA: 1, notaB: 2, notaC: 3, notaD: 4, notaFinal: 10}]},
  ]
  
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  trocarNomeEsconderMostrarMaterias(){
    if(this.esconderMostrarMaterias == esconderMostrarMaterias.mostrar){
      this.esconderMostrarMaterias = esconderMostrarMaterias.esconder;
    }else{
      this.esconderMostrarMaterias = esconderMostrarMaterias.mostrar;
    }
  }

  selecionarMateria(materia: string){
    let materiaFiltrada2 = this.materiasModel.find(x=> x.nomeMateria.toUpperCase() == materia.toUpperCase())
    this.dataSource = new MatTableDataSource(materiaFiltrada2!.notaAlunos);
  }
}

export enum esconderMostrarMaterias{
  esconder = "Esconder",
  mostrar = "Mostrar"
}
