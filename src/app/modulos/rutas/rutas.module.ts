import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { Routes, RouterModule }         from '@angular/router';

import { AutorizacionService }          from "../../servicios/autorizacion.service";

import { MaterialDashboardComponent }   from "../../componentes/material-dashboard/material-dashboard.component";
import { LoginComponent }               from "../../componentes/login/login.component";
import { RegistroComponent }            from "../../componentes/registro/registro.component";
import { PrincipalComponent }           from "../../componentes/principal/principal.component";
import { PageNotFoundComponent }        from "../../componentes/page-not-found/page-not-found.component";
import { PalabrasComponent }            from "../../componentes/palabras/palabras.component";
import { AdivinaElNumeroComponent }     from "../../componentes/adivina-el-numero/adivina-el-numero.component";
import { AgilidadAritmeticaComponent }  from "../../componentes/agilidad-aritmetica/agilidad-aritmetica.component";
import { AnagramaComponent }            from "../../componentes/anagrama/anagrama.component";
import { PuntajesComponent }            from "../../componentes/puntajes/puntajes.component";

const rutas: Routes = [
  { path: "", component: LoginComponent },
  { path: "registro", component: RegistroComponent },
  { path: "principal", component: PrincipalComponent, canActivate:[AutorizacionService], children:[
    { path: "inicio", component: MaterialDashboardComponent, canActivate:[AutorizacionService] },
    { path: "palabras", component: PalabrasComponent, canActivate:[AutorizacionService] },
    { path: "agilidad-aritmetica", component: AgilidadAritmeticaComponent, canActivate:[AutorizacionService] },
    { path: "adivina-el-numero", component: AdivinaElNumeroComponent, canActivate:[AutorizacionService] },
    { path: "anagrama", component: AnagramaComponent, canActivate:[AutorizacionService] },
    { path: "puntajes", component: PuntajesComponent, canActivate:[AutorizacionService] }
  ] },
  { path: "**", component: PageNotFoundComponent }
 ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(rutas)
  ],
  exports: [RouterModule],
  declarations: []
})
export class RutasModule { }
