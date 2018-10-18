import { Component, OnInit } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';
import { JwtHelperService } from "@auth0/angular-jwt";

import { ConexionService } from "../../servicios/conexion.service";

@Component({
  selector: 'app-anagrama',
  templateUrl: './anagrama.component.html',
  styleUrls: ['./anagrama.component.css']
})
export class AnagramaComponent implements OnInit {

  public palabras = [
    "mochila",
    "edificio",
    "casa",
    "mansion",
    "auto",
    "perro",
    "lancha",
    "moto",
    "espejo",
    "pastel",
    "computadora",
    "jwt",
    "javascript",
    "videojuegos",
    "amistad",
    "teclado",
    "cocina",
    "ducha",
    "cuchara",
    "cuchillo",
    "tenedor",
    "comida",
    "tijera",
    "angular",
    "ionic",
    "montaña",
    "cielo",
    "america",
    "europa",
    "africa",
    "asia",
    "oceania",
    "argentina",
    "antartida",
    "perro",
    "gato",
    "cerdo",
    "tigre",
    "paloma"
  ];

  public token: any;

  public puntos;
  public record;
  public intentosRestantes;
  public cargarRecord;
  public ocultarGameOver;

  public palabraUsuario;
  public palabraSeleccionada;
  public palabraRandom;

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

  ngOnInit() {
  }

  EmpezarJuego() {

    this.ocultarGameOver = true;
    this.puntos = 0;
    this.record = 0;
    this.intentosRestantes = 5;
    this.palabraUsuario = "";

    this.conexion.ObtenerScore(this.token.correo, "puntaje_PPT").subscribe(
      exito => {

        this.record = (exito as any).puntaje;
        this.GenerarPalabraAleatoria();
      },
      error => this.notificationsService.error("Error", JSON.stringify(error))
    );
  }

  GenerarPalabraAleatoria() {

    let numero = Math.floor(Math.random() * ((this.palabras.length - 1) - 0)) + 0;
    this.palabraSeleccionada = this.palabras[numero];
    console.log(`Numero: ${numero}, Palabra seleccionada: ${this.palabraSeleccionada}`);

    let a = this.palabraSeleccionada.split("");
    let n = a.length;

    for (let i = n - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }

    this.palabraRandom = a.join("");
    console.log(`La palabra random es: ${this.palabraRandom}`);
  }

  VerficarPalabra() {

    if (this.palabraUsuario == this.palabraSeleccionada) {

      this.notificationsService.success("Bien!", "Sigue avanzando.");
      this.GenerarPalabraAleatoria();
      this.palabraUsuario = "";
      this.puntos++;

      if (this.puntos > this.record) {

        this.record = this.puntos;

        if (!this.cargarRecord) {

          this.notificationsService.info("Buen trabajo!", "Has superado tu record.");
          this.cargarRecord = true;
        }
      }
    } else {

      this.intentosRestantes--;

      if(this.intentosRestantes <= 0) {

        this.GameOver();
      } else {

        this.notificationsService.info("Ups...", "Esa no es la palabra, sigue intentado!");
      }
    }
  }

  GameOver() {

    this.ocultarGameOver = false;

    if (this.cargarRecord) {

      this.notificationsService.info("OK!", "Almacenando tu nuevo puntaje");
      this.conexion.CargarScore(this.token.correo, "puntaje_PPT", this.puntos.toString()).subscribe(
        exito => console.log("Exito" + JSON.stringify(exito)),
        error => console.log("Error" + JSON.stringify(error))
      );
    }
  }
}
