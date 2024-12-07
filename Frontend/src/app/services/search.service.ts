import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchDataSubject = new BehaviorSubject<{
    term: string;
    filters: any;
  }>({
    term: '',
    filters: { title: true, prepTime: false, difficulty: false },
  });
  searchData$ = this.searchDataSubject.asObservable();

  setSearchData(data: { term: string; filters: any }) {
    this.searchDataSubject.next(data);
  }
}
