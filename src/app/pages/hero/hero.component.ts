import { Component, OnInit } from '@angular/core';
import { HeroModel } from 'src/app/models/hero.model';
import {NgForm } from '@angular/forms';
import { HeroService } from 'src/app/services/hero.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  loadingHero = false;

  heroModel:HeroModel;
  constructor(private readonly _heroService:HeroService,
              private  readonly _activatedRoute:ActivatedRoute) {
   }

  private initialHeroModel():void{
    this.heroModel = new HeroModel(true);
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    console.log(id);
    if( id !== 'new' ){
      this.loadingHero = true;
      this._heroService.get(id).subscribe(hero=>{
        if(hero){
          this.heroModel = hero;
          this.heroModel.id = id;
        }
        this.loadingHero = false;
      })
    }
  }

  ngOnInit(): void {
    this.initialHeroModel();
  }

  public  onSubmit(form:NgForm):void{
    if(!form.valid) {
      this.markAllAsTouched(form);
      return;
    }

    Swal.fire({
      title: 'Please wait',
      text: 'Saving information',
      icon: 'info',
      allowOutsideClick: false
    });

    Swal.showLoading();
    let request: Observable<any>;
    if(this.heroModel.id)  request =  this._heroService.update(this.heroModel);
    if(!this.heroModel.id) request = this._heroService.create(this.heroModel);

    request.subscribe(()=>{
      Swal.fire({
        title: this.heroModel.name,
        text: 'Saved',
        icon: 'success'
      });
    });
  }

  private markAllAsTouched(form:NgForm):void{
    Object.values(form.controls).forEach(control=>{
      if(!control.valid) control.markAsTouched();
    })
  }

}
