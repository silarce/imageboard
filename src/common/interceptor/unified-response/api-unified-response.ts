import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
  ApiProperty,
} from '@nestjs/swagger';

// 這個 Class 只為了給 Swagger 解析外層結構用
class UnifiedResponseDto<T> {
  @ApiProperty({ description: '是否成功' })
  success: boolean;

  data: T;
}

const ApiUnifiedResponse = <DataDto extends Type<unknown>>(
  dataDto?: DataDto,
) => {
  if (dataDto) {
    return applyDecorators(
      // 告訴 Swagger 載入我們自訂的外層結構和實際的 DTO
      ApiExtraModels(UnifiedResponseDto, dataDto),
      // 覆寫回傳 Schema，讓它包含外層結構和實際的 DTO
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(UnifiedResponseDto) },
            {
              properties: {
                data: {
                  $ref: getSchemaPath(dataDto), // 將 data 指定為你傳入的 DTO
                },
              },
            },
          ],
        },
      }),
    );
  } else {
    return applyDecorators(
      ApiExtraModels(UnifiedResponseDto),
      ApiOkResponse({
        schema: { $ref: getSchemaPath(UnifiedResponseDto) },
      }),
    );
  }
};

export { ApiUnifiedResponse };
