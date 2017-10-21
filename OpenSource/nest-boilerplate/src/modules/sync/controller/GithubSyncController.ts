import { Controller, Post } from '@nestjs/common';

@Controller('/github')
export class HelloController {
  @Post()
  sync() {
    // 获取到请求数据

    return 'Nest.js Boilerplate @ 王下邀月熊';
  }
}
