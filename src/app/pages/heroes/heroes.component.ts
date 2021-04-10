import { Component, OnInit } from '@angular/core';
import { HeroService } from 'src/app/services/hero.service';
import { HeroModel } from '../../models/hero.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes:HeroModel[]=[];
  showAlertLoading = true;
  constructor(private readonly _heroService: HeroService) { }

  ngOnInit(): void {
    this._heroService.getAll().subscribe(data=>{
      this.heroes = data;
      this.showAlertLoading = false;
    });
  }

  public deleteHero(hero: HeroModel, index:number){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete it?',
      icon: 'question',
      showConfirmButton : true,
      showCancelButton : true
    }).then(res=>{
      if(res.isConfirmed){
        this._heroService.delete(hero.id).subscribe(()=>{
          this.heroes.splice(index, 1);
        });
      }
    })
  }
}
