import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsAfterDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];

          if (!value || !relatedValue) {
            return true;
          }

          const end = value instanceof Date ? value : new Date(String(value));
          const start =
            relatedValue instanceof Date
              ? relatedValue
              : new Date(String(relatedValue));

          if (Number.isNaN(end.getTime()) || Number.isNaN(start.getTime())) {
            return false;
          }

          return end.getTime() >= start.getTime();
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} harus sama atau setelah ${relatedPropertyName}`;
        },
      },
    });
  };
}
