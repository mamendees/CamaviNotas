import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MateriasService } from '../services/materias.service';
import { NotasService } from '../services/notas.service';

export interface ApiUpdateNotas {
  materia: MateriasViewModel;
  nomeMateria?: string;
  materiaId?: string
  notaA: number;
  notaB: number;
  notaC: number;
  notaD: number;
  status: "A" | "R" | "N";
  textoContestacao?: string;
  tiaAluno?: string;
  notaFinal: number;
  _id?: any;
}

export interface NotasViewModel {
  materiaId: string;
  notaA: number;
  notaB: number;
  notaC: number;
  notaD: number;
  status: "A" | "R" | "N";
  textoContestacao: string;
  _id: any;
  nomeMateria?:string;
}

export interface AlunoViewModel {
  nomeAluno: string;
  nota: NotasViewModel;
  notaFinal: number;
  tiaAluno: string;
  materia?: MateriasViewModel;
}

export interface MateriasViewModel {
  nomeMateria: string;
  _id: any;
  professores: any;
}


let ELEMENT_DATA: AlunoViewModel[] = [

];

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit, AfterViewInit {
  //Atributos
  displayedColumns: string[] = ['nomeAluno', 'tiaAluno', 'notaA', 'notaB', 'notaC', 'notaD', 'notaFinal', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  formTia!: FormGroup;
  tiaProfessor!: string;
  nomeMateriaSelecionada: string = "";
  materiaIdSelecionada: any = "";
  sidebarOpened: boolean = false;
  selecaoDeMaterias: MateriasViewModel[] = [];
  esconderMostrarMaterias: esconderMostrarMaterias = esconderMostrarMaterias.mostrar;

  @ViewChild(MatSort) public sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('drawer') sidenav!: MatSidenav;

  //Construtor
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private materiasService: MateriasService,
    private notaService: NotasService
  ) { }
  ngOnInit(): void {
    this.createForm();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //Chamas API
  onSubmit() {
    this.tiaProfessor = this.formTia.get('tiaProfessor')?.value;
    this.materiasService.getMateriasPorTiaProfessor(this.tiaProfessor).subscribe((retornoApi: any) => {
      if (JSON.parse(retornoApi)) {
        let retornoMaterias: MateriasViewModel[] = JSON.parse(retornoApi) as MateriasViewModel[];
        this.selecaoDeMaterias = retornoMaterias;
        this.abrirSideNav();
      }
    }, (err: any) => console.log(err))
  }

  selecionarMateria(nomeMateria: string, materiaId: any) {
    if (!this.tiaProfessor || !materiaId) {
      return;
    }
    if (nomeMateria) {
      this.nomeMateriaSelecionada = nomeMateria;
    }

    this.materiaIdSelecionada = materiaId;
    let idLimpo = materiaId['$oid'];
    this.notaService.getNotasPorMaterias(idLimpo).subscribe((retornoApi: any) => {
      if (JSON.parse(retornoApi)) {
        let retorno: AlunoViewModel[] = JSON.parse(retornoApi) as AlunoViewModel[];

        let notasFormatadas: AlunoViewModel[] = retorno.map(x => {
          let notaFinal = (x.nota.notaA + x.nota.notaB + x.nota.notaC + x.nota.notaD) / 4;
          x.notaFinal = notaFinal <= 10 ? notaFinal : 99;
          return x;
        })

        this.popularForm(notasFormatadas);
      }
    }, (err: any) => console.log(err));
  }

  popularForm(entrada: AlunoViewModel[]) {
    this.dataSource = new MatTableDataSource(entrada);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //Formulario
  createForm() {
    this.formTia = this.formBuilder.group({
      tiaProfessor: ["", Validators.compose([Validators.required, Validators.pattern("[0-9]{8}")])]
    })
  }

  //Grid
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //SideNav
  abrirSideNav() {
    this.sidenav.open();
    this.trocarNomeEsconderMostrarMaterias();
  }
  trocarNomeEsconderMostrarMaterias() {
    if (this.esconderMostrarMaterias == esconderMostrarMaterias.mostrar) {
      this.esconderMostrarMaterias = esconderMostrarMaterias.esconder;
    } else {
      this.esconderMostrarMaterias = esconderMostrarMaterias.mostrar;
    }
  }

  //Dialog
  validarContestacaoAluno(element: any){  
    console.log(element)
  }

  openDialogAlteracao(element: any) {
    globalDadoAlteracao = element;
    const dialogRef = this.dialog.open(DialogAlterarNota);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let materia: MateriasViewModel = this.selecaoDeMaterias.find(x => x.nomeMateria == this.nomeMateriaSelecionada) as MateriasViewModel

        let dadosApiUpdateNotas: ApiUpdateNotas =  {
          materia: materia,
          nomeMateria: this.nomeMateriaSelecionada,
          materiaId: this.materiaIdSelecionada['$oid'],
          notaA: globalDadoAlteracao.nota.notaA,
          notaB: globalDadoAlteracao.nota.notaB,
          notaC: globalDadoAlteracao.nota.notaC,
          notaD: globalDadoAlteracao.nota.notaD,
          notaFinal: globalDadoAlteracao.notaFinal,
          status: globalDadoAlteracao.nota.status,
          textoContestacao: globalDadoAlteracao.nota.textoContestacao ?? "" ,
          tiaAluno: globalDadoAlteracao.tiaAluno,
          _id: globalDadoAlteracao.nota._id
        }
        console.log("dadosApiUpdateNotas", dadosApiUpdateNotas)
        this.notaService.updateNota(dadosApiUpdateNotas).subscribe(() => {
          this.selecionarMateria(globalDadoAlteracao.nota.nomeMateria!, materia._id);
        }, err => {
          console.log(err);
          this.selecionarMateria(globalDadoAlteracao.nota.nomeMateria!, materia._id);
        })
      }
    });
  }

}

let globalDadoAlteracao: AlunoViewModel;

@Component({
  selector: 'dialog-alterar-nota',
  templateUrl: '../../app/dialog/alterarNota.html',
  styles: ['.disabled{cursor: not-allowed;}']
})
export class DialogAlterarNota {
  //Atributos
  formAlterarNota!: FormGroup;

  //Construtor
  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.createForm();
  }

  //Métodos Principal
  alterarNotas() {
    if (this.validarNotaFoiModificada('notaANova', 'notaA')) {
      globalDadoAlteracao.nota.notaA = Number(this.obterValorCampoFormulario('notaANova'));
    }
    if (this.validarNotaFoiModificada('notaBNova', 'notaB')) {
      globalDadoAlteracao.nota.notaB = Number(this.obterValorCampoFormulario('notaBNova'));
    }
    if (this.validarNotaFoiModificada('notaCNova', 'notaC')) {
      globalDadoAlteracao.nota.notaC = Number(this.obterValorCampoFormulario('notaCNova'));
    }
    if (this.validarNotaFoiModificada('notaDNova', 'notaD')) {
      globalDadoAlteracao.nota.notaD = Number(this.obterValorCampoFormulario('notaDNova'));
    }
  }

  //Formulário
  createForm() {
    this.formAlterarNota = this.formBuilder.group({
      nomeAluno: { value: globalDadoAlteracao.nomeAluno, disabled: true, },
      tiaAluno: { value: globalDadoAlteracao.tiaAluno, disabled: true },
      notaAAntiga: { value: globalDadoAlteracao.nota.notaA, disabled: true },
      notaBAntiga: { value: globalDadoAlteracao.nota.notaB, disabled: true },
      notaCAntiga: { value: globalDadoAlteracao.nota.notaC, disabled: true },
      notaDAntiga: { value: globalDadoAlteracao.nota.notaD, disabled: true },
      notaANova: [, Validators.compose([Validators.max(10), Validators.min(0), Validators.pattern('^-?[0-9]\\d*(\\.\\d*)?$')])],
      notaBNova: [, Validators.compose([Validators.max(10), Validators.min(0), Validators.pattern('^-?[0-9]\\d*(\\.\\d*)?$')])],
      notaCNova: [, Validators.compose([Validators.max(10), Validators.min(0), Validators.pattern('^-?[0-9]\\d*(\\.\\d*)?$')])],
      notaDNova: [, Validators.compose([Validators.max(10), Validators.min(0), Validators.pattern('^-?[0-9]\\d*(\\.\\d*)?$')])],
    })
  }
  errorHandling(control: string, error: string) {
    return this.formAlterarNota.controls[control].hasError(error);
  }

  //Demais Métodos
  validarNotaFoiModificada(nota: string, notaAtributo: 'notaA' | 'notaB' | 'notaC' | 'notaD'): boolean {
    return this.formAlterarNota.get(nota)!.value && (globalDadoAlteracao.nota[notaAtributo] != this.formAlterarNota.get(nota)!.value)
  }
  obterValorCampoFormulario(campo: string): number {
    return this.formAlterarNota.get(campo)!.value;
  }
}

export enum esconderMostrarMaterias {
  esconder = "Esconder",
  mostrar = "Mostrar"
}
