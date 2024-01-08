/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import type { lmvc_controller_t, lmvc_scope_t } from '@lytical/lmvc/type';

/*import { navbar_svc } from '../navbar/svc';
import { popover_event_arg, popover_event_msg } from '../popover/event';
import { popover_confirm_arg, popover_confirm_msg } from '../popover/confirm';
import { PopoverOption } from 'bootstrap';*/

export abstract class form_controller<_t_ = unknown> implements lmvc_controller_t<_t_> {
  $can_unmount() {
    if(this.is_xhr()) {
      return new Promise<boolean>(res => {
        if(!confirm('leaving now will cancel the current request. select (OK) to leave or (Cancel) to stay.')) {
          res(false);
        }
        else {
          this.cancel_xhr();
          res(true);
        }
      });
    }
    return this.is_modified() ?
      new Promise<boolean>(res =>
        res(confirm('leaving now will discard your changes. select (OK) to leave or (Cancel) to stay.'))) : true;
  }

  protected cancel_xhr(): void {
  }

  $mount() {
    $(this.$scope!.node).find('[autofocus]').first().trigger('focus');
  }

  protected is_xhr() {
    return false;
  }

  protected is_modified() {
    return $(this.$scope!.node).find('.fi-dirty').length !== 0;
  }


  /*

  created() {
    this.forms = [];
    this.unsubscribe = [];
    this.navs = [];
    this.confirm = new Subject<popover_confirm_arg>();
    this.event = new Subject<popover_event_arg>();
    if(!this.nav_event) {
      this.nav_event = new Subject<[string, string, string]>();
      this.is_hosted = true;
    }
    else {
      this.is_hosted = false;
    }
    this.unsubscribe.push(this.nav_event.subscribe(msg => {
      if(this.$el) {
        if((this.is_default && msg[1] === '$default') || this.$el.id === msg[1]) {
          switch(msg[0]) {
            case 'show':
              this.show(msg[2]);
              break;
            case 'shown':
              this.shown(msg[2]);
              break;
            case 'hide':
              this.hide(msg[2]);
              break;
            case 'hidden':
              this.hidden(msg[2]);
              break;
          }
        }
      }
    }));
    if(!this.reg_form) {
      this.reg_form = new Subject<HTMLFormElement>();
    }
    this.unsubscribe.push(this.reg_form.subscribe(form => this.forms.push(form)));
  }

  destroyed() {
    this.before_leave();
    for(let item of this.unsubscribe) {
      try {
        item.unsubscribe();
      }
      catch(err) {
        console.error(err);
      }
    }
    this.unsubscribe = [];
  }

  protected do_remove(_evt: MouseEvent): void { }

  protected do_submit(_evt: MouseEvent): void { }

  protected handle_request<_t_ = any>(cb: (() => Observable<_t_> | undefined), evt?: MouseEvent, opt: handle_request_options = {}): PromiseLike<_t_ | undefined> {
    return new Promise<_t_>((res, rej) => {
    });
  }

  hide(_prev?: string) {
    for(let nav of this.navs) {
      nav[1].popover('dispose');
      nav[0].remove(nav[1]);
    }
  }

  hidden(_prev?: string) {
  }

  protected load_data(_route: Route) { }

  mounted() {
    this.$nextTick(() => {
      if(this.$refs.form && this.reg_form) {
        this.reg_form.next(this.$refs.form);
      }
      if(this.$refs.navbar_items) {
        let navs = this.navs;
        let items = $(this.$refs.navbar_items);
        items.children().each(function() {
          const el = $(this);
          navs.push([new navbar_svc(el.prop('id')), el.children()]);
          el.remove();
        });
        items.remove();
      }
      this.before_enter();
    });
  }

  protected popover_confirm(target: EventTarget, message: popover_confirm_msg, opt?: PopoverOption) {
    var tmp = $(target).closest('a,button');
    this.confirm.next({ target: tmp.length == 0 ? target : tmp[0], message: message, option: opt });
  }

  protected popover_event(target: EventTarget, message: popover_event_msg, opt?: PopoverOption) {
    var tmp = $(target).closest('a,button');
    this.event.next({ target: tmp.length == 0 ? target : tmp[0], message: message, option: opt });
  }

  protected remove(evt: MouseEvent) {
    if(this.xhr) {
      this.xhr.unsubscribe();
      this.xhr = undefined;
      this.popover_event(evt.target!, {
        error: '<b>you\'ve cancelled the request.</b><br>however the request may have already been processed.'
      });
    }
    else {
      this.popover_confirm(evt.target!, {
        item: this.confirm_delete,
        result: val => {
          if(val) {
            this.do_remove(evt);
          }
        }
      });
    }
  }

  protected reset_forms(reset_inputs?: true) {
    for(let form of this.forms) {
      if(reset_inputs) {
        form.reset();
      }
      for(let i = 0; i < form.length; ++i) {
        $(form[i]).trigger('reset');
      }
    }
  }

  show(_prev?: string) {
    this.navs.forEach(x => x[0].add(x[1]));
    setTimeout(() => $(this.$el).find('[autofocus]').focus(), 100);
  }

  shown(_prev: string) {
  }

  protected submit(evt: MouseEvent) {
    let target = $(evt.target!).closest('a, button');
    if(this.xhr) {
      this.xhr.unsubscribe();
      this.xhr = undefined;
      this.popover_event(target.get(0), {
        error: '<b>you\'ve cancelled the request.</b><br>however the request may have already been processed.'
      });
    }
    else if(this.forms.every(x => x.reportValidity())) {
      this.do_submit(evt);
    }
    else {
      this.forms.forEach(x => {
        for(let i = 0; i < x.length; ++i) {
          $(x[i]).trigger('blur', evt);
        }
      });
      this.popover_event(target.get(0), { error: 'please correct the form errors.' });
      setTimeout(() => target.popover('hide'), 3000);
    }
  }

  set $route(route: Route) {
    this.load_data(route);
  }

  protected get confirm_delete(): string { return 'this item'; }
  @property() protected reg_form!: Subject<HTMLFormElement>;
  @property() _id?: any;
  @property(Boolean) protected is_default?: true;
  private forms!: HTMLFormElement[];
  protected navs!: [navbar_svc, JQuery<Element>][];
  protected confirm!: Subject<popover_confirm_arg>;
  protected event!: Subject<popover_event_arg>;
  @property() protected nav_event!: Subject<[string, string, string]>;
  protected unsubscribe!: SubscriptionLike[];
  protected is_hosted!: boolean;

  get is_new(): boolean {
    return this._id === '$new';
  }

  // the following are to support Vue controllers
  readonly $el!: Element;
  readonly $options!: controllerOptions<Vue>;
  readonly $parent!: Vue;
  readonly $root!: Vue;
  readonly $children!: Vue[];
  readonly $refs!: { navbar_items: Element, form: HTMLFormElement, [_: string]: Vue | Element | Vue[] | Element[] };
  readonly $slots!: { [key: string]: VNode[] | undefined };
  readonly $scopedSlots!: { [key: string]: NormalizedScopedSlot | undefined };
  readonly $isServer!: boolean;
  readonly $data!: Record<string, any>;
  readonly $props!: Record<string, any>;
  readonly $ssrContext!: any;
  readonly $vnode!: VNode;
  readonly $attrs!: Record<string, string>;
  readonly $listeners!: Record<string, Function | Function[]>;
  $mount!: (elementOrSelector?: Element | string, hydrating?: boolean) => this;
  $forceUpdate!: () => void;
  $destroy!: () => void;
  $set!: typeof Vue.set;
  $delete!: typeof Vue.delete;
  $watch!: <T>(expOrFn: any, callback: (this: this, n: T, o: T) => void, options?: WatchOptions) => (() => void);
  $on!: (event: string | string[], callback: Function) => this;
  $once!: (event: string | string[], callback: Function) => this;
  $off!: (event?: string | string[], callback?: Function) => this;
  $emit!: (event: string, ...args: any[]) => this;
  $nextTick!: (callback?: (this: this) => void) => any;
  $createElement!: CreateElement;
  $router!: VueRouter;
*/
  $model!: _t_;
  $scope?: lmvc_scope_t;
  $view = [];
}