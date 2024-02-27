import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList : Gif[] =[]; //arreglo donde ira mi respuesta del endpoint

  private _tagsHistory: string[]=[];
  private apiKey  :       string='AoUTLUBp1xbSW1QtlyWR31Cf7CUcwodi';
  private serviceUrl :  string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient) {
    this.loadLocalStorage();
    console.log("Gifs Service ready ...");
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  private organizeHistory(tag:string){
    tag = tag.toLowerCase();

    if ( this._tagsHistory.includes(tag) ){
      this._tagsHistory = this._tagsHistory.filter((oldTag)=> oldTag !== tag );
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0,10);
    this.saveLocalStorage();

  }

  private saveLocalStorage():void{
    localStorage.setItem( 'history' , JSON.stringify( this._tagsHistory ))
  }

  private loadLocalStorage():void{
    if( !localStorage.getItem('history') ) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
    //const temporal = localStorage.getItem('history');

    if(this._tagsHistory.length === 0) return;

    this.searchTag (this._tagsHistory[0]);

  }

  // para forma 1 y 2
  //async searchTag(tag:string): Promise<void>{
  searchTag(tag:string):void{
    if ( tag.length === 0  ) return;
    this.organizeHistory(tag);
    console.log(this._tagsHistory);

    //forma 1------------------
    // const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=AoUTLUBp1xbSW1QtlyWR31Cf7CUcwodi&q=valorant&limit=10')
    // const data = resp.json() ;
    // console.log(data);

    //forma 2 --------
    // fetch('https://api.giphy.com/v1/gifs/search?api_key=AoUTLUBp1xbSW1QtlyWR31Cf7CUcwodi&q=valorant&limit=10')
    // .then( resp => resp.json() )
    // .then( data => console.log(data))

    //FORMA 3 con uso de httpclientmodule de angular------


    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 10)
      .set('q', tag)

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`,{params})
    .subscribe( resp  => {
      this.gifList = resp.data;
      //console.log({gifs: this.gifList});

    });



  }
}
