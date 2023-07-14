import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type === 'body') {
      this.processValues(value);
    }
    return value;
  }

  private isObject(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private processValues(values: any): void {
    Object.keys(values).forEach((key) => {
      if (key !== 'password') {
        const value = values[key];
        if (this.isObject(value)) {
          this.processValues(value);
        } else if (typeof value === 'string') {
          values[key] = value.trim() || undefined;
        }
        if (values[key] === undefined) {
          throw new BadRequestException('You cannot enter such data');
        }
      }
    });
  }
}
