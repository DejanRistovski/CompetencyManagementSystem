import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalVariables} from '../_helpers/globalVariables';
import {LoginInfo} from "../_model/loginInfo.model";
import {User} from "../_model/user.model";
import {BehaviorSubject, take} from "rxjs";
import {SignUpInfo} from "../_model/signUpInfo.model";
import {UserRoleEnum} from "../_model/enum/user-role.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') ?? 'null')
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  login(loginInfo: LoginInfo) {
    const response = this.http.post<User>(GlobalVariables.backendBaseUrl + '/login', loginInfo);
    response.pipe(take(1)).subscribe(resp => {
      this.setAuthToken(resp.token);
      localStorage.setItem('currentUser', JSON.stringify(resp));
      this.currentUserSubject.next(resp);
    });
    return response;
  }

  register(signUpInfo: SignUpInfo) {
    return this.http.post(GlobalVariables.backendBaseUrl + '/register', signUpInfo);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.getValue() !== null;
  }

  get userRole(): UserRoleEnum {
    return this.currentUserSubject.getValue()?.userRole!;
  }

  get isManager(): boolean {
    return this.currentUserSubject.getValue()?.userRole! === UserRoleEnum.SKILL_MANAGEMENT;
  }

  private setAuthToken(token: string) {
    localStorage.setItem('authToken', token);
  }
}
