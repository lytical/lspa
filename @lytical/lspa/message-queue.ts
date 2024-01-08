/* @preserve
  (c) 2021 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import { Subject } from 'rxjs';
import type { Observable } from 'rxjs';

const def_post_timeout = 30000; // 30 seconds.
const timeout_error = new Error('timeout');
const post_msg_topic_prefix = 'message_queue_async:post_message:response:';

let _id = 0;

export class message_queue {
  end_topic(topic: string, err?: any) {
    var sub = this.sub[topic];
    if(sub) {
      if(err) {
        sub[1].error(err);
      }
      else {
        sub[1].complete();
      }
      return true;
    }
    return false;
  }

  /**
   * get the observable associated with the specified topic.
   * @param topic the name or regex pattern of the topic to subscribe to.
   * @returns an observable.
   */
  get_topic<_t_>(topic: topic_name_t): Observable<payload_t<_t_>> {
    var key = topic.toString();
    var sub = this.sub[key];
    if(!sub) {
      this.sub[key] = sub = [
        typeof topic === 'string' ? new RegExp(`^${topic}$`) : topic,
        new Subject<payload_t>()
      ];
      sub[1].subscribe({
        complete: () => delete this.sub[key],
        error: ex => { delete this.sub[key]; console.error(ex); }
      });
    }
    return sub[1];
  }

  /**
   * publish a copy of the specified message to all subscribers of the specified topic. note: messages that are objects are shallow cloned.
   * @param topic identifies the audience the message is directed to.
   * @param msg the message to publish.
   */
  publish_message(topic: string, msg?: any) {
    let rt = 0;
    for(let key in this.sub) {
      const sub = this.sub[key]!;
      if(sub[0].test(topic)) {
        sub[1].next([topic, typeof msg === 'object' && msg !== null ? { ...msg } : msg]);
        ++rt;
      }
    }
    return rt;
  }

  private readonly sub: Record<string, subscription_t | undefined> = {};
}

export class message_queue_async extends message_queue {
  /**
   * publish a message that will be asynchronously handled by a single and responded to.
   * @param topic identifies the audience the message is directed to.
   * @param msg the message to post asynchronously.
   * @param timeout the timeout in milliseconds.
   * @returns a tuple containing the resulting promise and correlation id.
   */
  post_message<_t_>(topic: string, msg?: any, timeout: number = def_post_timeout): [Promise<_t_>, number] {
    const cid = ++_id;
    return [new Promise<_t_>((res, rej) => {
      const payload: post_message_t = {
        cid,
        msg,
        rsp: `${post_msg_topic_prefix}${cid}`
      };
      let watchdog: any;
      const sub = this.get_topic<post_message_t>(payload.rsp).subscribe({
        next: rsp => {
          clearTimeout(watchdog);
          sub.unsubscribe();
          const data = rsp[1];
          if(data.ex) {
            rej(data.ex);
          }
          else {
            res(data.msg!);
          }
        }
      });
      watchdog = setTimeout(() => {
        sub.unsubscribe();
        rej(timeout_error);
      }, timeout);
      try {
        super.publish_message(topic, payload);
      }
      catch(ex) {
        sub.unsubscribe();
        clearTimeout(watchdog);
        rej(ex);
      }
    }), cid];
  }

  publish_message(topic: string, msg?: any) {
    if(msg?.cid && msg?.rsp) {
      throw new Error('not-supported: use reply_to_message(...)');
    }
    return super.publish_message(topic, msg);
  }

  reply_to_message(msg: post_message_t) {
    try {
      return super.publish_message(msg.rsp, msg);
    }
    finally {
      this.end_topic(msg.rsp);
    }
  }
}

export interface post_message_t<_t_ = any> {
  /** the message correlation identifier */
  readonly cid: number;
  /** error response if any */
  ex?: unknown;
  /** the request or response data */
  msg?: _t_;
  /** the response topic name */
  readonly rsp: string;
}

export type payload_t<_t_ = any> = [string, _t_];
type subscription_t = [RegExp, Subject<payload_t>];
export type topic_name_t = string | RegExp;