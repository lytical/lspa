/* @preserve
  (c) 2020 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

/*
import { PopoverOption } from 'bootstrap';
import { Subscription, Observable } from 'rxjs';
import { controller, property, is_controller, controller_ctx } from '@lytical/lmvc/controller';
import { popover } from './main';

export type popover_msg_arg<_t_ = any> = {
  target: EventTarget;
  option?: PopoverOption;
  message: _t_;
};

export type popover_msg_observable<_t_ = any> = Observable<popover_msg_arg<_t_> | null>;

@is_controller({
  html: '@lytical/lspa/popover/controller.html'
})
export class popover_controller<_t_ = any> extends controller {
  async dispose(ctx: controller_ctx) {
    const rs = super.dispose(ctx);
    if(rs) {
      await rs;
    }
    if(this.popover) {
      this.popover.dispose();
    }
    if(this.sub) {
      this.sub.unsubscribe();
      this.sub = undefined;
    }
  }

  protected hide() {
    return this.popover ? this.popover.hide() : Promise.resolve();
  }

  async $mount(ctx: controller_ctx) {
    if(this.$el) {
      this.popover = new popover({ content: this.$el, html: true, trigger: 'manual' });
      if(typeof this.event === 'object' && typeof this.event.subscribe === 'function') {
        this.sub = this.event.subscribe(evt => {
          if(evt === null) {
            this.on_hide();
            this.popover!.hide();
          }
          else {
            this.popover!.show(evt.target, this.on_show(evt));
          }
        });
      }
    }
  }

  protected on_hide(): void { }

  protected on_show(msg: popover_msg_arg<_t_>): PopoverOption {
    return msg.option || {};
  }

  @property() private event?: popover_msg_observable<_t_>;
  private popover?: popover;
  private sub?: Subscription;
  $el?: Element;
}
*/