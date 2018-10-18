import { BrowserModule }              from '@angular/platform-browser';
import { NgModule }                   from '@angular/core';
import { FormsModule }                from '@angular/forms';
import { BrowserAnimationsModule }    from '@angular/platform-browser/animations';
import { HttpClientModule }           from '@angular/common/http';
import { LayoutModule }               from '@angular/cdk/layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatTableModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatTooltipModule
}                                     from '@angular/material';
import { SimpleNotificationsModule }  from 'angular2-notifications';

import { RutasModule }                from "./modulos/rutas/rutas.module";

import { ConexionService }            from "./servicios/conexion.service";
import { AutorizacionService }        from "./servicios/autorizacion.service";
import { JwtHelperService }           from "@auth0/angular-jwt";

import { AppComponent }               from './app.component';
import { RegistroComponent }          from './componentes/registro/registro.component';
import { LoginComponent }             from './componentes/login/login.component';
import { PrincipalComponent }         from './componentes/principal/principal.component';
import { PageNotFoundComponent }      from './componentes/page-not-found/page-not-found.component';
import { MaterialNavComponent }       from './componentes/material-nav/material-nav.component';
import { MaterialDashboardComponent } from './componentes/material-dashboard/material-dashboard.component';
import { PuntajesComponent }          from './componentes/puntajes/puntajes.component';
import { AdivinaElNumeroComponent }   from './componentes/adivina-el-numero/adivina-el-numero.component';
import { AgilidadAritmeticaComponent } from './componentes/agilidad-aritmetica/agilidad-aritmetica.component';
import { PalabrasComponent }          from './componentes/palabras/palabras.component';
import { AnagramaComponent } from './componentes/anagrama/anagrama.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    PageNotFoundComponent,
    LoginComponent,
    PrincipalComponent,
    MaterialNavComponent,
    MaterialDashboardComponent,
    PuntajesComponent,
    AdivinaElNumeroComponent,
    AgilidadAritmeticaComponent,
    PalabrasComponent,
    AnagramaComponent
  ],
  imports: [
    BrowserModule,
    RutasModule,
    HttpClientModule,
    FormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule
  ],
  providers: [
    ConexionService,
    AutorizacionService,
    JwtHelperService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
