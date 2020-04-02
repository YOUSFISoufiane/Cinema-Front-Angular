import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CinemaService} from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public villes;
  public salles;
  public cinemas;
  public currentvilles;
  public currentprojections;
  public  currentcinemas;
  public projections;
  private selectedTickets: any;
  private selected: boolean;
  constructor(public cinemaService: CinemaService) { }

  ngOnInit() {
    this.cinemaService.getVilles()
      .subscribe(data => {
       this.villes = data;
      }, err => {
        console.log(err);
      });

  }
  onGetcinemas(v) {
    this.currentvilles = v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data => {
        this.cinemas = data;
      }, err => {
        console.log(err);
      });

  }

  onGetSalles(c) {
    this.currentcinemas=c;
    this.cinemaService.getSalles(c)
      .subscribe(data => {
        this.salles = data;
        this.salles._embedded.salles.forEach(salle => {
          this.cinemaService.getProjections(salle)
            .subscribe(data => {
              salle.projections = data;
            }, err => {
              console.log(err);
            });

        })
      }, err => {
        console.log(err);
      });

  }

  onGetTicketsPlaces(p) {
    this.currentprojections = p;
    //console.log(p);
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data => {
        this.currentprojections.tickets = data;
        this.selectedTickets=[];
      }, err => {
        console.log(err);

      })
  }

  onSelectedTicket(t) {
    if(!t.selected){
        t.selected=true;
        this.selectedTickets.push(t);
      }
    else {
      t.selected=false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    }
    console.log(this.selectedTickets);
  }

  getTicketClass(t) {
    let str = "btn ticket ";
    if (t.selected==true){
      str+="btn-warning ";
    }
    else if (t.reserve==true){
      str+=" btn-danger";
    }else {
      str+="btn-success";
    }
return str;
  }

  onPayerTiket(dataForm) {
    console.log(dataForm);
    let tickets = [];
    this.selectedTickets.forEach(t=>{
      tickets.push(t.id);
    });
      dataForm.tickets=tickets;
      this.cinemaService.payerTicket(dataForm)
        .subscribe(data => {
         alert("Tickets reservés avec succée")
          this.onGetTicketsPlaces(this.currentprojections);
        }, err => {
          console.log(err);

        })
    }



  }

