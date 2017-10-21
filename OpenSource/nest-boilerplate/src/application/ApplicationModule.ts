import { Module } from '@nestjs/common';
import { HelloController } from './controller/HelloController';

@Module({
  modules: [],
  controllers: [HelloController],
})
export class ApplicationModule {}
