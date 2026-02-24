import { Module } from '@nestjs/common';

import { FooModule } from './module/foo/foo.module';

@Module({
  imports: [FooModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
