import { Congregation } from './../setup/congregation.model';
import { first } from 'rxjs/operator/first';
import { Circuito } from './../setup/circuito.model';
import { User } from './../auth/user.model';
import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import 'moment/locale/pt-br';
import * as moment from 'moment';




@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent implements OnInit {


  users = [];

  totalhistorico = [];
  totalhistorico_all = [];

  userscomp = [];
  userscomp_all = [];

  showNow = false;

  semresposta = [];
  semresposta_all = [];

  naoresposta = [];
  naoresposta_all = [];

  simresposta = [];
  simresposta_all = [];

  totalnao = [];
  totalnao_all = [];

  totalsub = [];
  totalsub_all = [];

  subresposta = [];
  subresposta_all = [];

  congregations = [];
  congregations_all = [];
  circuitos = [];
  circuito: Circuito;
  congregation: Congregation;

  abasemconfirmacao = false;
  abarecusadas = false;
  abaperiodo = true;
  abasubstituicao = false;
  abagraficos = false;
  abacompanheiro = false;

  totaldesignacoes = 0;
  totalcompanheiro = 0;



  dataForm: FormGroup;




  dados = {

    semresposta: 0

  };

   constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

    this.congregation = null;
    this.circuito = null;

    this.dataForm = new FormGroup({
      begin: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required)
    });




  }


    onSubmit() {
      const year_begin = moment.utc(this.dataForm.value.begin).year();
      const month_begin = moment.utc(this.dataForm.value.begin).month();
      const day_begin =  moment.utc(this.dataForm.value.begin).date();

      const year_end = moment.utc(this.dataForm.value.end).year();
      const month_end = moment.utc(this.dataForm.value.end).month();
      const day_end =  moment.utc(this.dataForm.value.end).date();



        const data = {
          begin: new Date(year_begin, month_begin, day_begin, 0, 0, 0),
          end: new Date(year_end, month_end, day_end, 0, 0, 0),
          };

          const timeDiff = Math.abs(data.end.getTime() - data.begin.getTime());
          const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));


          if (diffDays > 30) {
            alert('O range de seleção deve ter no máximo 31 dias!');
            return;
          }

          this.users = [];

          this.totalhistorico = [];
          this.totalhistorico_all = [];

          this.userscomp = [];
          this.userscomp_all = [];

          this.totaldesignacoes = 0;

          this.semresposta = [];
          this.semresposta_all = [];

          this.naoresposta = [];
          this.naoresposta_all = [];

          this.simresposta = [];
          this.simresposta_all = [];

          this.totalnao = [];
          this.totalnao_all = [];

          this.totalsub = [];
          this.totalsub_all = [];

          this.subresposta = [];
          this.subresposta_all = [];

          this.congregations = [];
          this.congregations_all = [];
          this.circuitos = [];

    this.authService.getAllLedsReport(data)
      .subscribe(
        (leds) => {
          console.log(leds);

          leds.sort(function (a, b) {
            return (a.idescala.data > b.idescala.data) ? 1 : (a.idescala.data < b.idescala.data) ? -1 : 0;
          });



          for (let i = 0; i < leds.length; i++) {

            if (
              leds[i].sim == true &&
              leds[i].nao == false ) {


              const findnao = leds.filter(a => {
                if (a.sub && leds[i].iduser) {
                return (a.horacode == leds[i].horacode && a.sub.userId == leds[i].iduser._id && a.idescala._id == leds[i].idescala._id );
                }
                });
              if (findnao.length > 0) {
                // nao faz nada
                console.log('OP');
              } else {
              const obj = { user: leds[i].iduser, data: leds[i].idescala.dia };
              this.simresposta_all.push(obj);
              this.simresposta.push(obj);
              }

            }


            if (
              leds[i].sim == false &&
              leds[i].nao == false) {

              const obj = { user: leds[i].iduser, data: leds[i].idescala.dia };
              this.semresposta_all.push(obj);
              this.semresposta.push(obj);

              this.simresposta_all.push(obj);
              this.simresposta.push(obj);

            }

            if (
              leds[i].sim == false &&
              leds[i].nao == true) {

              const obj = { user: leds[i].iduser, data: leds[i].idescala.dia };
              this.naoresposta_all.push(obj);
              this.naoresposta.push(obj);

              this.simresposta_all.push(obj);
              this.simresposta.push(obj);



          }

          if (
            leds[i].lock == true &&
            leds[i].nao == true) {

            const obj = { user: leds[i].sub, data: leds[i].idescala.dia };
            this.subresposta_all.push(obj);
            this.subresposta.push(obj);

        }
        }




        this.naoresposta_all.sort(function (a, b) {
        try {
          return (a.user.firstName > b.user.firstName ) ? 1 : (a.user.firstName  < b.user.firstName ) ? -1 : 0;
        } catch (e) {
          console.log(e);
        }
        });
        this.naoresposta.sort(function (a, b) {
        try {
          return (a.user.firstName  > b.user.firstName ) ? 1 : (a.user.firstName < b.user.firstName ) ? -1 : 0;
        } catch (e) {
          console.log(e);
        }
        });

        this.subresposta_all.sort(function (a, b) {
          try {
            return (a.user.firstName > b.user.firstName ) ? 1 : (a.user.firstName  < b.user.firstName ) ? -1 : 0;
          } catch (e) {
            console.log(e);
          }
          });
          this.subresposta.sort(function (a, b) {
          try {
            return (a.user.firstName  > b.user.firstName ) ? 1 : (a.user.firstName < b.user.firstName ) ? -1 : 0;
          } catch (e) {
            console.log(e);
          }
          });

     /*      confirmadas = leds.length - this.subresposta_all.length;
          recusadas = this.naoresposta_all.length;
          sresposta = this.semresposta_all.length; */

          this.totaldesignacoes = leds.length -  this.subresposta_all.length;


          this.authService.getAllCongregation()
            .subscribe((congregations: Congregation[]) => {
              this.congregations_all = congregations;
              this.congregations = congregations;

              this.congregations.sort(function (a, b) {
                return (a.nome > b.nome) ? 1 : (a.nome < b.nome) ? -1 : 0;
              });

              this.authService.getAllCircuito()
                .subscribe(
                  (circuitos: Circuito[]) => {
                    this.circuitos = circuitos;

                    this.authService.getlistAllUsers()
                    .subscribe(
                      ( users: User[]) => {
                          this.users = users;
                          users.sort((a , b) => {
                              if (a.firstName < b.firstName) return -1;
                              if (a.firstName > b.firstName) return 1;
                              return 0;

                          });

                          for (let i = 0; i < this.users.length; i++) {

                            const sim = this.simresposta_all.filter(a => {
                              try {
                              return (a.user._id == this.users[i].userId);
                             } catch (e) {
                             console.log(e);
                             }
                            });
                            const nao = this.naoresposta_all.filter(a => {
                              try {
                              return (a.user._id == this.users[i].userId);
                            } catch (e) {
                              console.log(e);
                              }

                            });

                            const sem = this.semresposta_all.filter(a => {
                              try {
                              return (a.user._id == this.users[i].userId);
                            } catch (e) {
                              console.log(e);
                              }

                            });


                            const obj = {
                              user: this.users[i],
                              sim: sim.length,
                              nao: nao.length,
                              total: sim.length
                            };

                            this.totalhistorico_all.push(obj);

                            if (obj.nao > 0) {
                            this.totalnao_all.push(obj);
                            }



                            const sub = this.subresposta_all.filter(a => {
                              try {
                              return (a.user.userId == this.users[i].userId);
                            } catch (e) {
                              console.log(e);
                              }

                            });
                            const objsub = {
                              user: this.users[i],
                              sub: sub.length
                            };

                            if (objsub.sub > 0) {
                            this.totalsub_all.push(objsub);
                            }


                          }

                          this.totalhistorico_all.sort((a , b) => {
                            if (a.user.firstName < b.user.firstName) return -1;
                            if (a.user.firstName > b.user.firstName) return 1;
                            return 0;

                        });

                          this.totalhistorico = this.totalhistorico_all.filter(a => a.user.firstName != null);

                          this.totalnao_all.sort((a, b) => b.nao - a.nao );
                          this.totalnao = this.totalnao_all;

                          this.totalsub_all.sort((a, b) => b.sub - a.sub );
                          this.totalsub = this.totalsub_all;

                          this.userscomp_all = this.users.filter(a => a.conjuge != null || a.responsable != null);
                          this.userscomp = this.userscomp_all;


                          this.showNow = true;
                        }


                      );


                  });



            });



        });





  }

  getStyle(sex: string) {

    if (sex == 'M') return 'blue';
    if (sex == 'F') return '#FF4081';

  }

  getStyleId(id) {

    const iduser = this.users.filter(a => a.userId == id);

    if (iduser.length > 0) {

    if (iduser[0].sex == 'M') return 'blue';
    if (iduser[0].sex == 'F') return '#FF4081';
    }

  }

  getTelegram(number) {
    if (number != null) return 'SIM';
    return 'NÃO';
  }

  encontraCongregacao(id) {
    const congregation = this.congregations.filter(a => a.id == id);
    if (congregation.length > 0) return congregation[0].nome;
    else return ' ';
  }

  encontraCircuito(id) {
    const circuit = this.circuitos.filter(a => a.id == id);

    if (circuit.length > 0) return circuit[0].nome;
    else return ' ';

  }

  encontraId(id) {
    const iduser = this.users.filter(a => a.userId == id);

    if (iduser.length > 0) return `${iduser[0].firstName} ${iduser[0].lastName} `;
    else return ' ';

  }

  onCircuito() {

    this.semresposta = [];
    this.naoresposta = [];
    this.subresposta = [];
    this.totalnao = [];
    this.totalsub = [];
    this.userscomp = [];
    this.totalhistorico = [];
    if (!this.circuito) {
      this.semresposta = this.semresposta_all;
      this.naoresposta = this.naoresposta_all;
      this.totalnao = this.totalnao_all;
      this.totalsub = this.totalsub_all;
      this.userscomp = this.userscomp_all;
      this.subresposta = this.subresposta_all;
      this.congregations = this.congregations_all;
      this.totalhistorico = this.totalhistorico_all;
    } else {

    const cong = this.congregations_all;
    this.congregations = cong.filter(a => a.circuit == this.circuito.nome);

    const sem = this.semresposta_all;
    this.semresposta = sem.filter(a => {


      try {
        if (a.user.circuito == this.circuito.id) return true;
      } catch (e) {
        console.log(e);
      }



    });

    const nao = this.naoresposta_all;
    this.naoresposta = nao.filter(a => {


      try {
        if (a.user.circuito == this.circuito.id) return true;
      } catch (e) {
        console.log(e);
      }



    });


    const totnao = this.totalnao_all;
    this.totalnao = totnao.filter(a => {


      try {
        if (a.user.circuito == this.circuito.id) return true;
      } catch (e) {
        console.log(e);
      }



    });

    const totsub = this.totalsub_all;
    this.totalsub = totsub.filter(a => {


      try {
        if (a.user.circuito == this.circuito.id) return true;
      } catch (e) {
        console.log(e);
      }



    });

    const sub = this.subresposta_all;
    this.subresposta = sub.filter(a => {


      try {
        if (a.user.circuito == this.circuito.id) return true;
      } catch (e) {
        console.log(e);
      }



    });

    const comp = this.userscomp_all;
    this.userscomp = comp.filter(a => {


      try {
        if (a.circuito == this.circuito.id) return true;
      } catch (e) {
        console.log(e);
      }



    });

    const tothist = this.totalhistorico_all;
    this.totalhistorico = tothist.filter(a => {


      try {
        if (a.user.circuito == this.circuito.id) return true;
      } catch (e) {
        console.log(e);
      }



    });


    this.congregation = null;
  }

  }

  onCongregacao() {

    this.semresposta = [];
    this.naoresposta = [];
    this.subresposta = [];
    this.totalnao = [];
    this.totalsub = [];
    this.userscomp = [];
    this.totalhistorico = [];
    if (!this.congregation) {

      if (!this.circuito) {
        this.semresposta = this.semresposta_all;
        this.naoresposta = this.naoresposta_all;
        this.totalnao = this.totalnao_all;
        this.totalsub = this.totalsub_all;
        this.userscomp = this.userscomp_all;
        this.subresposta = this.subresposta_all;
        this.congregations = this.congregations_all;
        this.totalhistorico = this.totalhistorico_all;
      } else {
      const sem = this.semresposta_all;
      this.semresposta = sem.filter(a => {


        try {
          if (a.user.circuito == this.circuito.id) return true;
        } catch (e) {
          console.log(e);
        }



      });

      const nao = this.naoresposta_all;
      this.naoresposta = nao.filter(a => {


        try {
          if (a.user.circuito == this.circuito.id) return true;
        } catch (e) {
          console.log(e);
        }



      });

      const totnao = this.totalnao_all;
      this.totalnao = totnao.filter(a => {


        try {
          if (a.user.circuito == this.circuito.id) return true;
        } catch (e) {
          console.log(e);
        }



      });

      const totsub = this.totalsub_all;
      this.totalsub = totsub.filter(a => {


        try {
          if (a.user.circuito == this.circuito.id) return true;
        } catch (e) {
          console.log(e);
        }



      });


      const sub = this.subresposta_all;
      this.subresposta = sub.filter(a => {


        try {
          if (a.user.circuito == this.circuito.id) return true;
        } catch (e) {
          console.log(e);
        }



      });

      const comp = this.userscomp_all;
      this.userscomp = comp.filter(a => {


        try {
          if (a.circuito == this.circuito.id) return true;
        } catch (e) {
          console.log(e);
        }



      });


      const tothist = this.totalhistorico_all;
      this.totalhistorico = tothist.filter(a => {


        try {
          if (a.user.circuito == this.circuito.id) return true;
        } catch (e) {
          console.log(e);
        }



      });




    }

    } else {
    const sem = this.semresposta_all;
    this.semresposta = sem.filter(a => {


      try {
        if (a.user.congregation == this.congregation.id) return true;
      } catch (e) {
        console.log(e);
      }



    });

    const nao = this.naoresposta_all;
    this.naoresposta = nao.filter(a => {


      try {
        if (a.user.congregation == this.congregation.id) return true;
      } catch (e) {
        console.log(e);
      }



    });


    const totnao = this.totalnao_all;
    this.totalnao = totnao.filter(a => {


      try {
        if (a.user.congregation == this.congregation.id) return true;
      } catch (e) {
        console.log(e);
      }



    });

    const totsub = this.totalsub_all;
    this.totalsub = totsub.filter(a => {


      try {
        if (a.user.congregation == this.congregation.id) return true;
      } catch (e) {
        console.log(e);
      }



    });


    const sub = this.subresposta_all;
    this.subresposta = sub.filter(a => {


      try {
        if (a.user.congregation._id == this.congregation.id) return true;
      } catch (e) {
        console.log(e);
      }



    });


    const comp = this.userscomp_all;
    this.userscomp = comp.filter(a => {


      try {
        if (a.congregation == this.congregation.id) return true;
      } catch (e) {
        console.log(e);
      }



    });


    const tothist = this.totalhistorico_all;
    this.totalhistorico = tothist.filter(a => {


      try {
        if (a.user.congregation == this.congregation.id) return true;
      } catch (e) {
        console.log(e);
      }



    });

  }
}

onAba0() {
  this.abaperiodo = true;
  this.abasemconfirmacao = false;
  this.abarecusadas = false;
  this.abasubstituicao = false;
  this.abagraficos = false;
  this.abacompanheiro = false;

}

onAba1() {
  this.abaperiodo = false;
  this.abasemconfirmacao = true;
  this.abarecusadas = false;
  this.abasubstituicao = false;
  this.abagraficos = false;
  this.abacompanheiro = false;

}

onAba2() {
  this.abaperiodo = false;
  this.abasemconfirmacao = false;
  this.abarecusadas = true;
  this.abasubstituicao = false;
  this.abagraficos = false;
  this.abacompanheiro = false;

}

onAba3() {
  this.abaperiodo = false;
  this.abasemconfirmacao = false;
  this.abarecusadas = false;
  this.abasubstituicao = true;
  this.abagraficos = false;
  this.abacompanheiro = false;

}

onAba4() {
  this.abaperiodo = false;
  this.abasemconfirmacao = false;
  this.abarecusadas = false;
  this.abasubstituicao = false;
  this.abagraficos = true;
  this.abacompanheiro = false;

}

onAba5() {
  this.abaperiodo = false;
  this.abasemconfirmacao = false;
  this.abarecusadas = false;
  this.abasubstituicao = false;
  this.abagraficos = false;
  this.abacompanheiro = true;

}

validMyForm() {
  if (!this.dataForm.valid) return true;

  return false;
}

sortDesc() {
  if (this.totalhistorico.length > 0)
  this.totalhistorico.sort((a, b) => b.total - a.total);
}

sortAsc() {
  if (this.totalhistorico.length > 0)
  this.totalhistorico.sort((a, b) => a.total - b.total);
}

sortAlpha() {
  if (this.totalhistorico.length > 0)
  this.totalhistorico.sort((a , b) => {
    if (a.user.firstName < b.user.firstName) return -1;
    if (a.user.firstName > b.user.firstName) return 1;
    return 0;

});
}



}
