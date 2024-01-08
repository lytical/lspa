/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

/*
import { is_controller } from '@lytical/lmvc/controller';
import { popover_msg_arg, popover_msg_observable, popover_controller } from './controller';
import { PopoverOption } from 'bootstrap';

export interface popover_confirm_msg {
  [_: string]: any;
  result?(value: boolean): void;
}

export type popover_confirm_arg = popover_msg_arg<popover_confirm_msg>;
export type popover_confirm_observable = popover_msg_observable<popover_confirm_msg>;

@is_controller({
  html: '@lytical/lspa/popover/confirm.html'
})
export class popover_confirm extends popover_controller<popover_confirm_msg> implements popover_confirm_msg {
  created() {
    this.result = val => { console.assert(false); }
  }

  click(value: boolean) {
    this.hide().then(() => {
      if(this.result) {
        this.result(value);
      }
    });
  }

  protected on_show(msg: popover_confirm_arg): PopoverOption {
    this.result = msg.message.result;
    return Object.assign({}, msg.option, <PopoverOption>{ trigger: 'manual' });
  }

  get is_disabled() {
    return false;
  }

  result?(value: boolean): void;
}
*/