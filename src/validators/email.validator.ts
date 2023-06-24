import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { OrdersService } from '../orders';
import { Order, Manager } from '@prisma/client';

@ValidatorConstraint({ async: true })
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly ordersService: OrdersService) {}
  async validate(email: string): Promise<boolean> {
    let user: Order | Manager;

    const order = await this.ordersService.getOrderByEmail(email);
    // const manager = await this.managersService.getManagerByEmail(email);

    return !user;
  }
}

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUniqueEmail',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsUniqueEmailConstraint,
    });
  };
}
