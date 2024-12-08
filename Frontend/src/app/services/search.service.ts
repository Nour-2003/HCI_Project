import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchDataSubject = new BehaviorSubject<{
    term: string;
    filters: {
      title: boolean;
      prepTime: string;
      difficulty: string;
    };
  }>({
    term: '',
    filters: { title: true, prepTime: '', difficulty: '' },
  });

  searchData$ = this.searchDataSubject.asObservable();

  setSearchData(data: { term: string; filters: any }) {
    this.searchDataSubject.next(data);
  }
}
