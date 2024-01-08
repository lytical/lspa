/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

/*
import type { Observable } from 'rxjs';
import spa_pubsub_sockjs from '@lytical/lspa/pubsub';

export class navbar_svc {
  constructor(id: string) {
    this.navbar_add_item_topic_name = this.get_navbar_topic_name(id, 'add');
    this.navbar_remove_item_topic_name = this.get_navbar_topic_name(id, 'remove');
    this.navbar_add_item_topic = spa_pubsub_sockjs.get_topic(this.navbar_add_item_topic_name);
    this.navbar_remove_item_topic = spa_pubsub_sockjs.get_topic(this.navbar_remove_item_topic_name);
  }

  add(element: Element | Element[] | JQuery<Element>) {
    spa_pubsub_sockjs.publish(this.navbar_add_item_topic_name, element);
  }

  remove(element: Element | Element[] | JQuery<Element>) {
    spa_pubsub_sockjs.publish(this.navbar_remove_item_topic_name, element);
  }

  private get_navbar_topic_name(id: string, action: string): string {
    return `/navbar/${id}/${action}`;
  }

  readonly navbar_add_item_topic: Observable<[string, Element | Element[] | JQuery<Element>]>;
  readonly navbar_remove_item_topic: Observable<[string, Element | Element[] | JQuery<Element>]>;
  private readonly navbar_add_item_topic_name: string;
  private readonly navbar_remove_item_topic_name: string;
}
*/