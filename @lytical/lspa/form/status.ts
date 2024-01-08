/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import { view } from '@lytical/lmvc/view';

class status {
  private changed(target: JQuery<HTMLElement>, items: JQuery<HTMLElement>, _mutations?: MutationRecord[]) {
    this.update(target, items, 'fi-invalid', 'fi-valid');
    this.update(target, items, 'fi-touched', 'fi-untouched');
    this.update(target, items, 'fi-dirty', 'fi-pristine');
  }

  dispose() {
    this.map.forEach(x => x.disconnect());
  }

  refresh(target: JQuery<HTMLElement>, observe: JQuery<HTMLElement>) {
    const items = observe.find('div.form-group.row');
    const self = this;
    items.each(function() {
      if(!self.map.has(this)) {
        let obs = new MutationObserver(x => self.changed(target, items, x));
        obs.observe(this, status.opt);
        self.map.set(this, obs);
      }
    });
    this.changed(target, items);
  }

  private update(target: JQuery<HTMLElement>, items: JQuery<HTMLElement>, check: string, reciprocal: string) {
    if(items.filter(function() {
      return $(this).hasClass(check)
    }).length) {
      target.removeClass(reciprocal);
      target.addClass(check);
    }
    else {
      target.removeClass(check);
      target.addClass(reciprocal);
    }
    if(items.filter(function() {
      return $(this).hasClass(check)
    }).length === items.length) {
      target.addClass(`${check}-all`);
    }
    else {
      target.removeClass(`${check}-all`);
    }
  }

  private static opt = {
    attributeFilter: ['class']
  };

  private map: Map<Node, MutationObserver> = new Map<Node, MutationObserver>();
}

@view()
export class spa_form_status {

  /*
  bind(el: HTMLElement, binding: form_status_view_ctx, _vnode: VNode, _oldVnode: VNode): void {
    if(!binding.def.status) {
      binding.def.status = new Map<HTMLElement, status>();
    }
    if(!binding.def.status.has(el)) {
      binding.def.status.set(el, new status());
    }
  }

  controllerUpdated(el: HTMLElement, binding: form_status_view_ctx, _vnode: VNode, _oldVnode: VNode): void {
    if(binding.def.status && binding.def.status.has(el)) {
      binding.def.status.get(el)!.refresh($(el), $(<any>binding.arg || el));
    }
  }

  inserted(el: HTMLElement, binding: form_status_view_ctx, _vnode: VNode, _oldVnode: VNode): void {
    setTimeout(() => {
      if(binding.def.status && binding.def.status.has(el)) {
        binding.def.status.get(el)!.refresh($(el), $(<any>binding.arg || el));
      }
    }, 1000);
  }

  unbind(el: HTMLElement, binding: form_status_view_ctx, _vnode: VNode, _oldVnode: VNode): void {
    if(binding.def.status && binding.def.status.has(el)) {
      binding.def.status.get(el)!.$dispose();
      binding.def.status.delete(el);
    }
  }
  */

  status?: Map<HTMLElement, status>;
}