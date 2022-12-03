import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../auth/auth.service";
import { Anuncio } from "../anuncio/anuncio.model";


@Component({
    selector: "app-anunciouser",
    templateUrl: "./anunciouser.component.html",
    styleUrls: ["./anunciouser.component.css"]
  })

  export class AnunciouserComponent implements OnInit {
    
    anuncios: Anuncio[];
    auth = true;

   
  
    constructor(private authService: AuthService) {}
  
ngOnInit() {
  

  
    
   
  
      this.authService.getAnuncio().subscribe((anuncios: Anuncio[]) => {
        this.anuncios = anuncios;
        this.anuncios.sort(function(a,b){
          return (a.id > b.id) ? -1 : (a.id < b.id) ? 1 : 0;
         });~

          
     this.anuncios.forEach(a => {
 
      let idxlink = a.mensagem.indexOf('http'); 
      if(idxlink >= 0)a.link = a.mensagem.substring(idxlink); 
      if(a.link){
        let sub =  a.link.substring(0, a.link.indexOf(' '));
        if(sub)a.link  = sub;
        a.mensagem = a.mensagem.replace( a.link, ' ');
     
      }

      
  console.log(a);
      
     });

     });

  


    }
  


 
  }
  