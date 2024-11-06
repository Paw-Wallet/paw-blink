import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseStringArrayPipe implements PipeTransform {
  private readonly include?: string[];

  constructor(include?: string[]) {
    this.include = include;
  }

  transform(value: any): string[] {
    if (value) {
      if (!Array.isArray(value)) {
        value = [value];
      }
      if (this.include && value?.some((t: any) => !this.include?.includes(t))) {
        throw new BadRequestException('Invalid value. Allowed values are: ' + this.include.join(', '));
      }
    }
    return value;
  }
}
