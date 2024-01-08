/* @preserve
  (c) 2020 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import { controller } from '@lytical/lmvc/controller';

@controller({ html: '@lytical/lspa/page/not-found.html' })
export class spa_page_not_found {
  $get_title() {
    return 'site page not found';
  }
}
