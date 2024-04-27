import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import {baseURL} from '../../utils/url.path.enum';
import {UserrolEnum} from "../../utils/userrol.enum";
import {ProcessHTTPMSgService} from "./ProcessHTTPMSg.service";
import {Token} from "@models/token.model";
import {Credentials} from "@models/credentials.model";
import {DomSanitizer} from "@angular/platform-browser";
import {UserList} from "@models/userList";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: Token | any;
  headers: HttpHeaders;
  initialLogin: Token | any;
  adminRoles = [UserrolEnum.ADMIN, UserrolEnum.SUPERVISOR]
  imageUser!: string;
  private url = baseURL;
  private dataUser?: Credentials;

  constructor(private http: HttpClient,
              private processHttpMsgService: ProcessHTTPMSgService,
              private sanitizer: DomSanitizer) {

    this.headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

  }

  get getUserActive() {
    return this.dataUser;
  }

  login(credentials: Credentials): Observable<any> {
    this.dataUser = credentials;
    return this.getToken();
  }

  loginUser(credentials: Credentials): Observable<any> {
    this.dataUser = credentials;
    return this.getTokenUser();
  }

  getUserGeneral(userName: string): Observable<any> {
    return this.http.post<any>(this.url + '/login', this.dataUser,
      {headers: this.headers, observe: 'response'})
      .pipe(map((users: any) => {
        return users.filter((user: any) => user.firstName == userName)
      }));
  }

  loginAdministrator(credentials: Credentials): Observable<Token> {
    return this.http.post<any>(this.url + '/login', credentials,
      {headers: this.headers, observe: 'response'}).pipe(
      map(response => {
        console.log(response);
        localStorage.setItem('adminUser', JSON.stringify(response.body));
        return this.decodeToken(response.body);
      })
    ).pipe(catchError(this.processHttpMsgService.handleError));
  }

  refreshToken() {
    console.log("Refresh token => Ok");
    return this.getToken();
  }

  decodeToken(jwt: any): Token {
    const decoded: any = jwt_decode(jwt);
    const token: Token = {};
    token.fullToken = jwt;
    token.company = decoded.company;
    token.fullname = decoded.fullname;
    token.rol = decoded.rol;
    token.company_type = decoded.company_type;
    token.user_id = decoded.user_id;
    token.username = decoded.username;
    const expiredAt = new Date();
    token.exp = expiredAt.getTime();
    this.token = token;
    this.saveUser(this.token, true);
    return token;
  }

  logout(): Observable<any> {
    return this.http.post(this.url + '/login/pos/out', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  adminLogged() {
    return (this.token && this.adminRoles.includes(this.token.rol));
  }

  storeInitialLogin() {
    this.initialLogin = this.token;
  }

  restoreInitialLogin() {
    if (this.initialLogin) {
      this.token = this.initialLogin;
      this.initialLogin = undefined;
      this.saveUser(this.token, true);
    }
  }

  public saveUser(token: any, set?: boolean) {
    if (set) {
      if (token != undefined) {
        localStorage.clear();
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('userName', JSON.stringify(this.dataUser!));
        localStorage.setItem('imageUser', JSON.stringify(this.imageUser!));
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      this.token = {};
    }
  }

  public clearUser() {
    localStorage.clear();
  }

  public loadUser() {
    console.log("Reload token from localstorage", localStorage.getItem('token'));
    if (localStorage.getItem('token')) {
      this.token = JSON.parse(localStorage.getItem('token')!);
      this.dataUser = JSON.parse(localStorage.getItem('userName')!);
      this.imageUser = JSON.parse(localStorage.getItem('imageUser')!);

      console.log("Reload token from localstorage", this.token);
    }
  }

  public getUsersList(): Observable<UserList[]> {
    return this.http.get<UserList[]>(this.url + '/login/pos/posuser', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  public getUserId(id: string): Observable<UserList> {
    return this.http.get<UserList>(this.url + `/login/pos/posuser/${id}`, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  private getTokenUser() {
    return this.http.post<any>(this.url + '/login/pos', this.dataUser,
      {headers: this.headers, observe: 'response'}).pipe(
      map(response => {
        console.log(response);
        return this.decodeToken(response.body);
      })
    ).pipe(catchError(this.processHttpMsgService.handleError));
  }

  private getToken() {
    return this.http.post<any>(this.url + '/Login/pos/user', this.dataUser,
      {headers: this.headers, observe: 'response'}).pipe(
      map(response => {
        console.log("Response", response);
        return this.decodeToken(response.body);
      })
    )//.pipe(map((resp: Token)=>{
      //this.getUserList( resp!.username!).subscribe( (user: any)=>{
      //  this.photoUser =  user.image ? this.sanitizer.sanitize(SecurityContext.NONE,
      //      this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + user.image))
      //      : undefined;
      //});
      //}))
      .pipe(catchError(this.processHttpMsgService.handleError));
  }


}
