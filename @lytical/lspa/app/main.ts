/* @preserve
  (c) 2020 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import { spa_util_http } from '../util/http';
import pubsub from '@lytical/lspa/pubsub';
import { pubsub_topic_id_sock_opened } from '@lytical/lspa/pubsub/svc';
import lmvc_app from '@lytical/lmvc/app';

const sub = pubsub
  .get_topic<string>(pubsub_topic_id_sock_opened)
  .subscribe({
    next: msg => {
      sub.unsubscribe();
      spa_util_http.init('1.0', msg[1]);
      pubsub.close();
      lmvc_app
        .bootstrap()
        .catch(ex => {
          console.error(ex);
          alert('failed to bootstrap the application. please check the console log for details.');
        });
    }
  });
pubsub.connect();