import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';
import { JwtHelperService } from "@auth0/angular-jwt";

import { ConexionService } from "../../servicios/conexion.service";

@Component({
  selector: 'app-agilidad-aritmetica',
  templateUrl: './agilidad-aritmetica.component.html',
  styleUrls: ['./agilidad-aritmetica.component.css']
})
export class AgilidadAritmeticaComponent implements OnInit {

  public token: any;

  public puntos;
  public record;
  public cargarRecord;
  public ocultarGameOver;

  public operador: number;
  public numero1: number;
  public numero2: number;
  public cuenta: string = "";
  public resultado: number;
  public numeroUsuario;

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

  ngOnInit() {
  }

  EmpezarJuego() {

    this.ocultarGameOver = true;
    this.puntos = 0;
    this.record = 0;
    this.segundos = 0;
    this.milisegundos = 0;
    this.numeroUsuario = "";
    this.cargarRecord = false;
    
    this.conexion.ObtenerScore(this.token.correo, "puntaje_AA").subscribe(
      exito => {

        this.record = (exito as any).puntaje;
        this.segundos = 5;
        this.milisegundos = 9;
        this.Timer();
        this.HacerCuenta();
      },
      error => this.notificationsService.error("Error", JSON.stringify(error))
    );
  }

  HacerCuenta() {

    this.operador = Math.floor(Math.random() * (4 - 1)) + 1;
    this.numero1 = Math.floor(Math.random() * (50 - 1)) + 1;
    this.numero2 = Math.floor(Math.random() * (50 - 1)) + 1;

    switch (this.operador) {

      case 1:
        this.cuenta = `${this.numero1} + ${this.numero2} = `;
        this.resultado = this.numero1 + this.numero2;
        break;

      case 2:
        this.cuenta = `${this.numero1} - ${this.numero2} = `;
        this.resultado = this.numero1 - this.numero2;
        break;

      case 3:
        this.numero1 = this.operador = Math.floor(Math.random() * (10 - 1)) + 1;
        this.numero2 = this.operador = Math.floor(Math.random() * (10 - 1)) + 1;
        this.cuenta = `${this.numero1} X ${this.numero2} = `;
        this.resultado = this.numero1 * this.numero2;
        break;

      default:
        console.log("Ups.. Algo salio mal. El valor de la variable evaluada es: " + this.operador);
    }

    console.log(`Resultado: ${this.resultado}`);
  }

  Calcular() {

    if (this.numeroUsuario == this.resultado.toString()) {

      this.notificationsService.success("Bien!", "Sigue avanzando.");
      this.HacerCuenta();
      this.numeroUsuario = "";
      this.input.nativeElement.focus();
      this.segundos = 5;
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
      this.conexion.CargarScore(this.token.correo, "puntaje_AA", this.puntos.toString()).subscribe(
        exito => console.log("Exito" + JSON.stringify(exito)),
        error => console.log("Error" + JSON.stringify(error))
      );
    }
  }
}
