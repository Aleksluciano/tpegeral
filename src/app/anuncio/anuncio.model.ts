export class Anuncio {

    link: string;
    constructor(public titulo?: string,  
                public mensagem?: string, 
                public avisado?: boolean,
                public avisadoemail?: boolean,  
                public id?: string,  
            ) {}

}