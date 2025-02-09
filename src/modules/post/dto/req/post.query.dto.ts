import { PickType } from '@nestjs/swagger';
import { BaseQueryDto } from '../../../../common/common.dto/base.query.dto';

export class PostQueryDto extends PickType(BaseQueryDto, [
  'page',
  'limit',
  'order',
]) {}
