/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

/*
import { is_controller, data } from '@lytical/lmvc/controller';
import { popover_confirm, popover_confirm_msg } from './confirm';
import { PopoverOption } from 'bootstrap';
import { popover_msg_arg } from './controller';

export interface popover_can_delete_msg extends popover_confirm_msg {
  item: string;
}

export type popover_can_delete_msg_arg = popover_msg_arg<popover_can_delete_msg>;

@is_controller({
  html: '@lytical/lspa/popover/can-delete.html'  
})
export class popover_can_delete extends popover_confirm {
  click(value: boolean) {
    this.confirm = '';
    super.click(value);
  }

  protected on_show(msg: popover_can_delete_msg_arg): PopoverOption {
    this.item = msg.message.item;
    return super.on_show(msg);
  }

  get is_disabled() {
    return this.confirm !== this.item;
  }

  @data() private confirm?: string;
  @data('item') private item?: string;
}
*/