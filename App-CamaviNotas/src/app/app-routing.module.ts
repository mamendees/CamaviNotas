import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CursosComponent } from './cursos/cursos.component';
import { HomeComponent } from './home/home.component';
import { MateriasComponent } from './materias/materias.component';
import { NotasAlunoComponent } from './notas-aluno/notas-aluno.component';
import { NotasComponent } from './notas/notas.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'notas/Professor', component: NotasComponent},
  {path: 'notas/Aluno', component: NotasAlunoComponent},
  {path: 'materias', component: MateriasComponent},
  {path: 'cursos', component: CursosComponent},
  {path: '**', component: PageNotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
