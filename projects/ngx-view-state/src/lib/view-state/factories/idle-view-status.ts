import { ViewStatusEnum } from '../models/view-status.enum';
import { ViewIdle } from '../models/view-status.model';

export function idleViewStatus(): ViewIdle {
  return {
    type: ViewStatusEnum.IDLE,
  };
}
