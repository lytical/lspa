/* @preserve
  (c) 2020 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import { view } from '@lytical/lmvc/view';
import type { Observer } from 'rxjs';

export type nav_msg = [string, string, string];
export type nav_subscriber = Observer<nav_msg>;

//const nav_link_selector = '.nav-item [aria-controls][data-toggle].nav-link';

@view()
export class spa_nav {
  /*
  bind(el: HTMLElement, binding: view_ctx) {
    const observer: nav_subscriber | undefined = binding.value;
    if(observer) {
      const link = $(el).find(nav_link_selector);
      link.on('show.bs.tab', evt => observer.next(['show', $(evt.target).attr('aria-controls')!, $(evt.relatedTarget).attr('aria-controls')!]));
      link.on('shown.bs.tab', evt => observer.next(['shown', $(evt.target).attr('aria-controls')!, $(evt.relatedTarget).attr('aria-controls')!]));
      link.on('hide.bs.tab', evt => observer.next(['hide', $(evt.target).attr('aria-controls')!, $(evt.relatedTarget).attr('aria-controls')!]));
      link.on('hidden.bs.tab', evt => observer.next(['hidden', $(evt.target).attr('aria-controls')!, $(evt.relatedTarget).attr('aria-controls')!]));
    }
  }

  inserted(el: HTMLElement) {
    setTimeout(() =>
      $(el)
        .find(nav_link_selector)
        .each(function() {
          const e = $(this);
          if(e.hasClass('active')) {
            e.trigger('show.bs.tab');
            e.trigger('shown.bs.tab');
          }
          else {
            e.trigger('hide.bs.tab');
            e.trigger('hidden.bs.tab');
          }
        }));
  }
  */
}