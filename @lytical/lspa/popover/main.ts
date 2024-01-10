/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

interface PopoverOption extends Record<string, unknown | undefined> { }

export class popover {
  constructor(private opt: PopoverOption) {
  }

  dispose() {
    popover.target.popover('dispose');
  }

  hide() {
    return new Promise<any>((res) => {
      popover.target.one('hidden.bs.popover', res);
      popover.target.popover('hide');
    });
  }

  show(target: EventTarget, opt?: PopoverOption) {
    if(popover.target.length && popover.target.get(0) !== target) {
      popover.target.popover('dispose');
    }
    if(opt !== undefined) {
      Object.assign(this.opt, opt);
    }
    popover.target = $(target);
    popover.target.popover('dispose');
    popover.target.popover(this.opt);
    if(this.opt.trigger === 'focus') {
      popover.target.on('hidden.bs.popover', () => {
        popover.target.popover('dispose');
        this.opt.trigger = 'manual';
        popover.target.popover(this.opt);
      });
    }
    return new Promise<any>((res) => {
      popover.target.one('shown.bs.popover', res);
      popover.target.popover('show');
    });
  }

  update() {
    return new Promise<any>((res) => {
      popover.target.one('inserted.bs.popover', res);
      popover.target.one('shown.bs.popover', res);
      popover.target.popover('update');
    });
  }

  private static target: JQuery<EventTarget> = $();
}