import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate',
  standalone: true,
  pure: false
})
export class PaginatePipe implements PipeTransform {
  transform(items: any[] | null, page: number, perPage: number): any[] {
    if (!items) return [];
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }
}