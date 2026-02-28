import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { CommonExceptionFilter } from './common/filter/common-exception.filter';
import { globalTransformPlugin } from './common/mongoose-plugins/global-transform.plugin';

// import { FooModule } from './module/foo/foo.module';

/**
 * 步驟
 * 1. 引入環境變數
 * 2. 建立ExceptionFilter
 * 3. 建立Mongoose連線，並套用全域的transform plugin
 */

@Module({
  imports: [
    // 1.
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),

    // 3
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory(connection: Connection) {
          connection.plugin(globalTransformPlugin);
          return connection;
        },
      }),
    }),

    // FooModule
  ],
  //
  controllers: [],
  //
  providers: [
    // 2
    {
      provide: APP_FILTER,
      useClass: CommonExceptionFilter,
    },
  ],
})
export class AppModule {}
