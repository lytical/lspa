/* @preserve
  (c) 2018 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import { message_queue, type payload_t } from '@lytical/lspa/message-queue';

export const pubsub_topic_id_sock_closed = 'sock:closed';
export const pubsub_topic_id_sock_opened = 'sock:opened';
export const pubsub_topic_id_sock_recv = (id: any) => `sock:recv:${id}`;

export default abstract class spa_pubsub_svc {
  abstract close(_code?: number, _reason?: string): void;
  
  abstract connect(): void;

  publish(topic: string, msg?: any, async?: false) {
    if(async === false) {
      this.queue.publish_message(topic, msg);
      return undefined;
    }
    return new Promise<void>((res, rej) => setTimeout(() => {
      try {
        this.queue.publish_message(topic, msg);
        res();
      }
      catch(ex) {
        rej(ex);
      }
    }, 0));
  }

  get_sock_recv_topic<_t_ = any>(id: string) {
    return this.get_topic(pubsub_topic_id_sock_recv(id));
  }

  get_topic<_t_ = any>(topic: string | RegExp) {
    return this.queue.get_topic<_t_>(topic);
  }

  abstract client_id?: string;
  private queue = new message_queue();
}

export type pubsub_message<_t_> = payload_t<_t_>;