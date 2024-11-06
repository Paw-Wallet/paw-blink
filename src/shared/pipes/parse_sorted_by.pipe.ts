import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { SortBy } from '../constants/common';

@Injectable()
export class ParseSortedByPipe implements PipeTransform {
  transform(value: any): { field: string; order: string } {
    if (value) {
      if (typeof value !== 'string') {
        throw new BadRequestException('Validation failed (string is expected)');
      }
      const [field, order] = value.split(',');
      if (!field) {
        throw new BadRequestException('Validation failed (field is required)');
      }
      if (!order || ![SortBy.ASC, SortBy.DESC].includes(order as SortBy)) {
        return { field, order: SortBy.ASC };
      }
      return { field, order };
    }
    return value;
  }
}
