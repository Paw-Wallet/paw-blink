import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParsePageSizePipe implements PipeTransform {
  transform(value: any): number {
    if (value) {
      const val = parseInt(value, 10);
      if (isNaN(val)) {
        throw new BadRequestException('Validation failed (numeric string is expected)');
      }
      return val;
    }
    return value;
  }
}
