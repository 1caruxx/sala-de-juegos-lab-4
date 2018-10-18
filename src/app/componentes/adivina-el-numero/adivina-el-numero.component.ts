import { Component, OnInit } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';
import { JwtHelperService } from "@auth0/angular-jwt";

import { ConexionService } from "../../servicios/conexion.service";

@Component({
  selector: 'app-adivina-el-numero',
  templateUrl: './adivina-el-numero.component.html',
  styleUrls: ['./adivina-el-numero.component.css']
})
export class AdivinaElNumeroComponent implements OnInit {

  private token: any;
  public puntos;
  public record;
  public intentosRestantes;
  public numeroUsuario;
  public numeroMisterioso;
  public cargarRecord ;
  public ocultarGameOver = true;

  public options = {
    position: ["top", "right"],
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  };

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
    this.intentosRestantes = 5;
    this.numeroUsuario = 1;
    this.cargarRecord = false;

    this.conexion.ObtenerScore(this.token.correo, "puntaje_AeN").subscribe(
      exito => {

        this.record = (exito as any).puntaje;
        this.numeroMisterioso = Math.floor(Math.random() * (101 - 1)) + 1;
        console.log(this.numeroMisterioso)
      },
      error => this.notificationsService.error("Error", JSON.stringify(error))
    );
  }

  Adivinar() {

    if(this.numeroUsuario == this.numeroMisterioso) {

      this.notificationsService.success("Bien!", "Ese era el numero!");
      this.numeroMisterioso = Math.floor(Math.random() * (101 - 1)) + 1;
      console.log(this.numeroMisterioso);
      this.puntos++;

      if(this.puntos > this.record) {

        this.record = this.puntos;

        if(!this.cargarRecord) {

          this.notificationsService.info("Buen trabajo!", "Has superado tu record.");
          this.cargarRecord = true;
        }
      }
    } else {

      this.notificationsService.info("Ups...", "Ese no era el número. Sigue intentado.");
      this.intentosRestantes--;

      if(this.intentosRestantes < 1) {

        this.ocultarGameOver = false;

        if(this.cargarRecord) {

          this.notificationsService.info("ok!", "almacenando tu nuevo puntaje");
          this.conexion.CargarScore(this.token.correo, "puntaje_AeN", this.puntos.toString()).subscribe(
            exito => console.log("Exito" + JSON.stringify(exito)),
            error => console.log("Error" + JSON.stringify(error))
          );
        }
      }
    }
  }
}
