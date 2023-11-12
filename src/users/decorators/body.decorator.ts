import {
  ExecutionContext,
  PipeTransform,
  Type,
  ValidationPipe,
  createParamDecorator,
} from '@nestjs/common';

export const RawBody = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    return request.body;
  },
);

export const Body = (...pipes: (Type<PipeTransform> | PipeTransform)[]) =>
  RawBody(
    ...pipes,
    new ValidationPipe({
      validateCustomDecorators: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
