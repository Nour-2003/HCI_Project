import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' }); // Get month as string
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }
}
