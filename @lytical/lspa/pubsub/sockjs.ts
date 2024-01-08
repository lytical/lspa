/* @preserve
  (c) 2018 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import SockJS from 'sockjs-client';
import spa_pubsub_svc, { pubsub_topic_id_sock_closed, pubsub_topic_id_sock_opened, pubsub_topic_id_sock_recv } from './svc';

const max_timeout = 30000; // 30 secs

export class spa_pubsub_sockjs extends spa_pubsub_svc {
  close(code?: number, reason?: string) {
    if(this.ref && --this.ref === 0 && this.sock) {
      this.was_opened = undefined;
      this.sock.close(code, reason);
      this.sock = undefined;
    }
  }

  connect() {
    if(!this.sock) {
      let sock = new SockJS(`${window.location.origin}/sock`);
      sock.onopen = () => {
        this.timeout = undefined;
        console.info('sock-opened');
        this.was_opened = true;
      }
      sock.onerror = evt => console.error({ 'sock-error': evt });
      sock.onmessage = init => {
        let msg: [string, any];
        try { msg = JSON.parse(init.data); } catch(err) { console.error(err); return; }
        console.assert(Array.isArray(msg) && msg.length === 2 && msg[0] === 'session');
        this.sock_id = msg[1];
        this.publish(pubsub_topic_id_sock_opened, this.sock_id);
        console.info(`sock-id:${this.sock_id}`);
        sock.onmessage = evt => {
          let msg: [string, any];
          try { msg = JSON.parse(evt.data); } catch(err) { console.error(err); return; }
          if(Array.isArray(msg) && msg.length === 2 && typeof msg[0] === 'string') {
            this.publish(pubsub_topic_id_sock_recv(msg[0]), msg[1]);
          }
        };
      };
      sock.onclose = () => {
        console.info(`sock-closed:${this.client_id}`);
        this.sock = undefined;
        this.publish(pubsub_topic_id_sock_closed, this.sock_id);
        this.sock_id = undefined;
        if(this.was_opened) {
          if(this.ref) {
            console.info('attempting to reopen...');
            switch(this.timeout) {
              case undefined:
                this.timeout = 0;
                break;
              case 0:
                this.timeout = 100;
                break;
              default:
                this.timeout = Math.min(this.timeout + 50, max_timeout);
                break;
            }
            setTimeout(() => this.connect(), this.timeout);
          }
        }
      };
      this.sock = sock;
    }
    ++this.ref;
  }

  get client_id() {
    return this.sock_id;
  }

  private ref = 0;
  private sock?: WebSocket;
  private sock_id?: any;
  private timeout?: number;
  private was_opened?: true;
}

export default new spa_pubsub_sockjs();