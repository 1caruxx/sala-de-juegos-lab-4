import { Component, OnInit } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';

import { ConexionService } from "../../servicios/conexion.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public correo;
  public password;
  public background = "";
  public ocultarSpinner = true;
  public options = {
    position: ["top", "right"],
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  };

  constructor(private conexion: ConexionService, private notificationsService: NotificationsService) {

    this.background = `../../../assets/img/background${Math.floor(Math.random() * (5 - 1)) + 1}.jpg`;
  }

  ngOnInit() { }

  Logear() {

    if(!this.correo || !this.password) {

      this.notificationsService.info("Ups...", "Todos los campos deben ser completados.");
      return;
    }

    this.ocultarSpinner = false;

    this.conexion.Logear(this.correo, this.password).subscribe(
      exito => {

        if((exito as any).valido == "false") {

          this.ocultarSpinner = true;
          this.notificationsService.info("Ups...", (exito as any).mensaje);
        } else {

          localStorage.setItem("token", (exito as any).token);
          location.href = "./principal/inicio";
        }
      },
      error => {
        
        this.ocultarSpinner = true;
        this.notificationsService.error("Error", (error as any).mensaje)
      }
    );
  }

}
