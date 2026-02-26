import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { CommonExceptionFilter } from './common/filter/common-exception.filter';

import { FooModule } from './module/foo/foo.module';

@Module({
  imports: [FooModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CommonExceptionFilter,
    },
  ],
})
export class AppModule {}
