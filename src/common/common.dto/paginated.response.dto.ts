import { ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';

export class PaginatedDto<TModel> {
  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'Current page number',
  })
  public page: number;

  @ApiProperty({
    type: 'number',
    example: 10,
    description: 'Total number of pages',
  })
  public pages: number;

  @ApiProperty({
    type: 'number',
    example: 100,
    description: 'Total number of items',
  })
  public countItems: number;

  @ApiProperty({
    description: 'List of entities',
    isArray: true,
    type: Object,
  })
  public entities: TModel[];
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  property: string,
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        properties: {
          data: {
            allOf: [
              { $ref: getSchemaPath(PaginatedDto) },
              {
                properties: {
                  [`${property}`]: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                },
              },
            ],
          },
        },
      },
    }),
  );
};
