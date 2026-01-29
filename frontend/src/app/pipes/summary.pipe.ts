import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary',
  standalone: true
})
export class SummaryPipe implements PipeTransform {

  transform(value: string | undefined, limit: number = 50): string | null {
    if (!value) {
      return null;
    }

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit) + '...';
  }
}