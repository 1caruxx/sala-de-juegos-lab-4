import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';
import { JwtHelperService } from "@auth0/angular-jwt";

import { ConexionService } from "../../servicios/conexion.service";

@Component({
  selector: 'app-palabras',
  templateUrl: './palabras.component.html',
  styleUrls: ['./palabras.component.css']
})
export class PalabrasComponent implements OnInit {

  public token: any;

  public puntos;
  public record;
  public cargarRecord;
  public ocultarGameOver = true;

  public palabraAleatoria;
  public palabraUsuario;

  public segundos;
  public milisegundos;

  public options = {
    position: ["top", "right"],
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  };

  @ViewChild('input') input: ElementRef;

  constructor(private conexion: ConexionService, private notificationsService: NotificationsService) {
    let JWTHelper = new JwtHelperService();
    this.token = JWTHelper.decodeToken(localStorage.getItem("token"));

    this.EmpezarJuego();
  }

  ngOnInit() { }

  EmpezarJuego() {

    this.ocultarGameOver = true;
    this.puntos = 0;
    this.record = 0;
    this.segundos = 0;
    this.milisegundos = 0;
    this.palabraUsuario = "";
    this.palabraAleatoria = "";
    this.cargarRecord = false;
    
    this.conexion.ObtenerScore(this.token.correo, "puntaje_mio").subscribe(
      exito => {

        this.record = (exito as any).puntaje;
        this.segundos = 4;
        this.milisegundos = 9;
        this.Timer();
        this.GenerarPalabra();
      },
      error => this.notificationsService.error("Error", JSON.stringify(error))
    );
  }

  GenerarPalabra() {

    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz";
  
    for (var i = 0; i < 5; i++) {
      
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    this.palabraAleatoria = text;
  }

  VerficarPalabra() {

    if (this.palabraUsuario == this.palabraAleatoria) {

      this.notificationsService.success("Bien!", "Sigue avanzando.");
      this.GenerarPalabra();
      this.palabraUsuario = "";
      this.input.nativeElement.focus();
      this.segundos = 4;
      this.milisegundos = 9;
      this.puntos++;

      if (this.puntos > this.record) {

        this.record = this.puntos;

        if (!this.cargarRecord) {

          this.notificationsService.info("Buen trabajo!", "Has superado tu record.");
          this.cargarRecord = true;
        }
      }
    } else {
      this.GameOver();
    }
  }

  Timer() {

    setInterval(() => {

      this.segundos--;
    }, 1000);

    setInterval(() => {

      this.milisegundos--;

      if (this.milisegundos == 0) {

        if (this.segundos == 0) {
          this.GameOver();
        }

        this.milisegundos = 9;
      }
    }, 100);
  }

  GameOver() {

    this.ocultarGameOver = false;

    if (this.cargarRecord) {

      this.notificationsService.info("OK!", "Almacenando tu nuevo puntaje");
      this.conexion.CargarScore(this.token.correo, "puntaje_mio", this.puntos.toString()).subscribe(
        exito => console.log("Exito" + JSON.stringify(exito)),
        error => console.log("Error" + JSON.stringify(error))
      );
    }
  }
}
