/* @preserve
  (c) 2020 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

/*
import { is_controller } from '@lytical/lmvc/controller';
import { popover_controller, popover_msg_arg, popover_msg_observable } from './controller';
import { PopoverOption } from 'bootstrap';

export interface popover_event_msg {
  error?: string;
  info?: string;
  success?: string;
}

export type popover_event_arg = popover_msg_arg<popover_event_msg>;
export type popover_event_observable = popover_msg_observable<popover_event_msg>;

@is_controller({
  html: '@lytical/lspa/popover/event.html'
})
export class popover_event extends popover_controller<popover_event_msg> implements popover_event_msg {
  protected on_hide() {
    this.error = this.info = this.success = undefined;
    super.on_hide();
  }

  protected on_show(msg: popover_event_arg): PopoverOption {
    this.error = this.info = this.success = undefined;
    Object.assign(this, msg.message);
    return Object.assign({}, msg.option, <PopoverOption>{
      trigger: msg.message.info ? 'manual' : 'focus'
    });
  }

  @data() error?: string;
  @data() success?: string;
  @data() info?: string;
}
*/