/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

/*
import { is_controller, controller } from '@lytical/lmvc/controller';
import { navbar_svc } from './svc';
import { Subscription } from 'rxjs';

@is_controller({ html: '@lytical/lspa/navbar/main.html' })
export default class navbar_main implements controller {
  created() {
    this.svc = new navbar_svc(this.id!);
    this.sub = [];
    this.sub.push(this.svc.navbar_add_item_topic.subscribe(msg => {
      if(this.$el) {
        let item: JQuery<Element>;
        if(msg[1] instanceof Element || Array.isArray(msg[1])) {
          item = $(msg[1])
        }
        else {
          item = msg[1];
        }
        const container = $(this.$el);
        item.each(function() {
          container.prepend(this);
        });
      }
    }));
    this.sub.push(this.svc.navbar_remove_item_topic.subscribe(msg => {
      if(this.$el) {
        let item: JQuery<Element>;
        if(msg[1] instanceof Element || Array.isArray(msg[1])) {
          item = $(msg[1])
        }
        else {
          item = msg[1];
        }
        item.each(function() {
          $(this).detach();
        });
      }
    }));
  }

  destroyed() {
    for(let sub of this.sub) {
      sub.unsubscribe();
    }
    this.sub = [];
  }

  private svc!: navbar_svc;
  private $el!: Element;
  private sub!: Subscription[];
  @property(String) private id?: string;
}
*/