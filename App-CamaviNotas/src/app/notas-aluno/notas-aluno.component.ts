import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

let observacaoNota: string = "";

export interface NotasAlunoViewModel {
  materia: string;
  notaA: number;
  notaB: number;
  notaC: number;
  notaD: number;
  notaFinal: number;
  status: "A" | "R" | "N"
}
const ELEMENT_DATA: NotasAlunoViewModel[] = [
  { materia: "Etica", notaA: 1, notaB: 2, notaC: 3, notaD: 4, notaFinal: 10, status: "N" },
  { materia: "Calculo1", notaA: 5, notaB: 6, notaC: 7, notaD: 8, notaFinal: 10, status: "A" },
  { materia: "Empreendedorismo", notaA: 5, notaB: 6, notaC: 7, notaD: 8, notaFinal: 10, status: "R" },
];


@Component({
  selector: 'app-notas-aluno',
  templateUrl: './notas-aluno.component.html',
  styleUrls: ['./notas-aluno.component.css']
})
export class NotasAlunoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['materia', 'notaA', 'notaB', 'notaC', 'notaD', 'notaFinal', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) public sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  openDialogAceitar(element: NotasAlunoViewModel) {
    const dialogRef = this.dialog.open(DialogAprovar);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let linha = document.getElementById(element.materia);
        linha!.style.backgroundColor = '#73e2a7'
      }
    });
  }

  openDialogRecusar(element: NotasAlunoViewModel) {
    const dialogRef = this.dialog.open(DialogDesAprovar);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let linha = document.getElementById(element.materia);
        linha!.style.backgroundColor = '#c96480'
        console.log(observacaoNota)
      }
    });
  }

}

@Component({
  selector: 'dialog-aprovar',
  templateUrl: '../../app/dialog/dialogAprovar.html',
})
export class DialogAprovar { }


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'dialog-desaprovar',
  templateUrl: '../../app/dialog/dialogDesaprovar.html',
})
export class DialogDesAprovar implements OnInit {
  formCliente!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }
  teste1(){
    observacaoNota = this.formCliente.get('observacao')!.value;
  }

  createForm() {
    this.formCliente = this.formBuilder.group({
      observacao: ["", Validators.required]
    })
  }
}

