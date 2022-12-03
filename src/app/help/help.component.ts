import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Circuito } from '../setup/circuito.model';

@Component({
    selector: 'app-help',
    template: `
    <div class="container">
    <div class="col-md-6">
             <h4>Caso seus dados pessoais estejam incorretos, envie um email para:</h4>
             <p><a href="mailto:{{email}}">{{email}}</a></p>

    </div>
    </div>

    `
})
export class HelpComponent {
 circuitos: Circuito[];
 email: string;
    constructor(private authService: AuthService) {}


    ngOnInit() {
    this.authService.getPerfil()
    .subscribe(datauser => {
        console.log(datauser);
        this.authService.getCircuito()
        .subscribe(data => {
            console.log(data);
            this.circuitos = data;
            this.email = this.encontraCircuito(datauser.circuito);

        });
        });

        }

        encontraCircuito(id) {
            let email = ' ';
            const circuit = this.circuitos.filter(a => a.id == id);


            if (circuit.length > 0) {
email =  'tpe.santoandre.' + circuit[0].nome.substring(0, 2).toLocaleLowerCase() +
circuit[0].nome.substring(3).toLocaleLowerCase() + '@gmail.com';
                    return email;
            } else return ' ';

          }
}
