import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { Identificadores } from './identificadores';
import { MessageService } from './message.service';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

/** The number of widgets present */
declare var firebase: any;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl = 'api/heroes'; // Url to web api
  private itemsCollection: AngularFirestoreCollection<Hero>;
  items: Observable<Hero[]>;
  private afs: AngularFirestore;
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private _afs: AngularFirestore) {
      this.itemsCollection = _afs.collection<Hero>('heroes');
      this.afs = _afs;
    }
  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    this.log(`fetched heroes`);
    return this.afs
      .collection<Hero>('heroes')
      .valueChanges();
  }
  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    return this.afs
      .collection('heroes', ref => ref.where('id', '==', id).limit(1))
      .valueChanges()
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  identificadorHeroe(): Observable<Identificadores> {
    return 
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    hero.uid = this.afs.createId();
    this.afs
    .doc<Identificadores>('identificadores/'+'XfXPyHpo1Q1geT1dR8xo')
    .valueChanges().pipe(
      tap(_ => this.log(`fetched hero id=${_}`)),
      catchError(this.handleError<any>('updateHero'))
    ).subscribe(function (data) {
      hero.id = data.heroe;
      this.log(`added hero w/ id=${data.heroe}`);
      this.itemsCollection.doc(hero.uid).set(hero);
    });
    return this.getHero(hero.id);
  }

  addX(hero: Hero){
    var heroIdRef = this.afs
    .doc<Identificadores>('identificadores/'+'XfXPyHpo1Q1geT1dR8xo');
    var heroRef = this.itemsCollection.doc('heroes');
    return this.afs.
  }
  /** PUT: update the hero on the server */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero (hero: Hero | string): void {
    const uid = typeof hero === 'string' ? hero : hero.uid;

    this.afs.collection('heroes').doc(uid).delete();
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
