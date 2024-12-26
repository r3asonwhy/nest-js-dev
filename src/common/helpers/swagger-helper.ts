import { ApiHeaderOptions, ApiHeader, ApiQuery } from '@nestjs/swagger';

interface CustomApiQuery {
  name: string;
  description?: string;
  required?: boolean;
  example?: any;
}

export function addHeaders(headers: ApiHeaderOptions[]): MethodDecorator[] {
  return headers.map(header =>
    ApiHeader({
      name: header.name,
      description: header.description,
      required: header.required,
      example: header.example,
    }),
  );
}

export function addQuery(queryParams: CustomApiQuery[]): MethodDecorator[] {
  return queryParams.map(query =>
    ApiQuery({
      name: query.name,
      description: query.description,
      required: query.required,
      example: query.example,
    }),
  );
}
