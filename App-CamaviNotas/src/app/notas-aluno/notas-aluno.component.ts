import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

let observacaoNota: string = "";

export interface MateriaViewModel {
  nomeMateria: string;
  professores: string[];
  turma: string;
  _id: any;
}
export interface NotasAlunoViewModel {
  materia: MateriaViewModel;
  nomeMateria?: string;
  materiaId?: string
  notaA: number;
  notaB: number;
  notaC: number;
  notaD: number;
  status: "A" | "R" | "N";
  testoContestacao?: string;
  tiaAluno?: string;
  notaFinal: number;
  _id?: any;
}



@Component({
  selector: 'app-notas-aluno',
  templateUrl: './notas-aluno.component.html',
  styleUrls: ['./notas-aluno.component.css']
})
export class NotasAlunoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nomeMateria', 'notaA', 'notaB', 'notaC', 'notaD', 'notaFinal', 'actions'];
  dadoInicialVazio: NotasAlunoViewModel[] = [];
  dataSource = new MatTableDataSource(this.dadoInicialVazio);
  formTia!: FormGroup;

  @ViewChild(MatSort) public sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private notaService: NotasService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.formTia = this.formBuilder.group({
      tiaAluno: ["", Validators.compose([Validators.required, Validators.pattern("[0-9]{8}")])]
    })
  }

  onSubmit() {
    let tia = this.formTia.get('tiaAluno')?.value;
    this.notaService.getNotas(tia).subscribe((retornoApi: any) => {
      if (JSON.parse(retornoApi) && JSON.parse(retornoApi) as NotasAlunoViewModel) {
        // console.log("JSON.parse(retornoApi)[0]", JSON.parse(retornoApi)[0])
        // this.notaService.updateNota(JSON.parse(retornoApi)[0]).subscribe(retornoApi => console.log("aaabc", retornoApi));
        let notasDoAluno: NotasAlunoViewModel[] = JSON.parse(retornoApi) as NotasAlunoViewModel[];

        let retorno: NotasAlunoViewModel[] = notasDoAluno.map(x => {
          x.nomeMateria = x.materia.nomeMateria;
          x.notaFinal = (x.notaA + x.notaB + x.notaC + x.notaD) / 4;
          return x;
        })
        this.popularForm(retorno);
      }
    }, (err: any) => {
      console.log(err)
    });
  }

  popularForm(entrada: NotasAlunoViewModel[]) {
    this.dataSource = new MatTableDataSource(entrada);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

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
        let elementoNovo: NotasAlunoViewModel = element;
        elementoNovo.notaFinal = 0;
        console.log(elementoNovo)
        // this.notaService.updateNota(element).subscribe(retornoApi => console.log(retornoApi))
        //let linha = document.getElementById(element.materia);
        //linha!.style.backgroundColor = '#73e2a7'
      }
    });
  }

  openDialogRecusar(element: NotasAlunoViewModel) {
    const dialogRef = this.dialog.open(DialogDesAprovar);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //let linha = document.getElementById(element.materia);
        //linha!.style.backgroundColor = '#c96480'
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
import { NotasService } from '../services/notas.service';
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
  teste1() {
    observacaoNota = this.formCliente.get('observacao')!.value;
  }

  createForm() {
    this.formCliente = this.formBuilder.group({
      observacao: ["", Validators.required]
    })
  }
}

