import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequesterService {
  ln=""
  constructor(private http: HttpClient) {
  }
  acurl=this.ln+'/ac';
  getSugg(term: string): Observable<any> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
     { params: new HttpParams().set('sw', term) } : {};

    var resp=this.http.get(this.acurl, options).pipe(
       catchError(this.handleError)
     );
    return resp;

  }
  getIP(){
    var lurl="http://ip-api.com/json/";
    var resp=this.http.get(lurl)
    return resp;
  }
  handleError(error) {
   let errorMessage = '';
   if (error.error instanceof ErrorEvent) {
     // client-side error
     errorMessage = `Error: ${error.error.message}`;
   } else {
     // server-side error
     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
   }
   return throwError(errorMessage);
 }

  findProd(query:any):any{
    var furl=this.ln+'/findprod';
    let q = {params:query};
    // console.log(q);
    var resp=this.http.get(furl, q).pipe(
       catchError(this.handleError)
     );
    return resp;

  }
  findProdDet(query:any):any{
    var fdurl=this.ln+'/findproddet';
    let q = {params:query};
    var resp=this.http.get(fdurl, q).pipe(
       catchError(this.handleError)
     );
    return resp;
  }
  findProdPhotos(query:any):any{
    var fdurl=this.ln+'/findprodphotos';
    let q = {params:query};
    var resp=this.http.get(fdurl, q).pipe(
       catchError(this.handleError)
     );
    return resp;
  }

  findSim(query:any):any{
    var fdurl=this.ln+'/findsim';
    let q = {params:query};
    var resp=this.http.get(fdurl, q).pipe(
       catchError(this.handleError)
     );
    return resp;
  }

}
