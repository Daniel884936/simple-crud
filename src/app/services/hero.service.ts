import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { HeroModel } from '../models/hero.model';
import { Observable } from 'rxjs';
import {map, delay} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private baseUrl = 'https://loginapp-5186a-default-rtdb.firebaseio.com';
  constructor(private readonly _http:HttpClient) { }

  public create(heroModel: HeroModel):Observable<HeroModel>{
    return this._http.post(`${this.baseUrl}/heroes.json`, heroModel).pipe(map((resp:any)=>{
      heroModel.id = resp.name;
      return heroModel;
    }))
  }


  public update(heroModel: HeroModel):Observable<any>{
    const heroCopy = {
      ...heroModel
    };
    delete heroCopy.id;
    return this._http.put(`${this.baseUrl}/heroes/${heroModel.id}.json`,heroCopy);
  }

  public getAll():Observable<HeroModel[]>{
    return  this._http.get(`${this.baseUrl}/heroes.json`)
    .pipe(map(this.createArrayHeroes))
  }

  public get(id:string):Observable<any>{
    return  this._http.get(`${this.baseUrl}/heroes/${id}.json`)
    .pipe(delay(1000))
  }

  public delete(id:string):Observable<any>{
    return  this._http.delete(`${this.baseUrl}/heroes/${id}.json`);
  }

  private createArrayHeroes(heroObjs:Object):HeroModel[]{
    let heroes: HeroModel[] = [];
    if(!heroObjs) return heroes;
    Object.keys(heroObjs).forEach(key=>{
      const hero:HeroModel = heroObjs[key];
      hero.id = key;
      heroes.push(hero);
    });
    return heroes;
  }
}
