import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>(''); // Holds the current search term
  searchTerm$ = this.searchTermSubject.asObservable(); // Observable for components to subscribe to

  updateSearchTerm(term: string): void {
    this.searchTermSubject.next(term); // Update the search term
  }
}
