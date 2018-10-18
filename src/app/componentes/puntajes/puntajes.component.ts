import { Component, OnInit } from '@angular/core';

import { ConexionService } from "../../servicios/conexion.service";

@Component({
  selector: 'app-puntajes',
  templateUrl: './puntajes.component.html',
  styleUrls: ['./puntajes.component.css']
})
export class PuntajesComponent implements OnInit {

  public displayedColumns: string[] = ['nombre', 'PPT', 'AA', 'AeN', 'mio'];
  public puntajes = [];
  public dataSource;

  constructor(private conexion: ConexionService) {

    this.conexion.ObtenerScores().subscribe(
      exito => {

        // this.puntajes = (exito as any).puntajes;
        // this.dataSource = this.puntajes;
        this.dataSource = (exito as any).puntajes;
      },
      error => alert("Error: " + JSON.stringify(error))
    );
  }

  ngOnInit() { }

}
