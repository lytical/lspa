import type { Observable } from 'rxjs';
import type { pubsub_message } from './pubsub/svc';

/**
 * this is a mock class instance to fix a (possible, but may be on me) typescript build bug (as of 2021-03).
 * note: if you're receiving 'not-implemented' errors, you must define an amd package for '@lytical/lspa/pubsub' to load desired service (sockjs/signalr) 
 **/
class spa_pubsub_stub {
  close(_code?: number, _reason?: string) { throw new Error('not-implemented'); }
  connect() { throw new Error('not-implemented'); }
  get_sock_recv_topic<_t_ = unknown>(_id: string): Observable<pubsub_message<_t_>> { throw new Error('not-implemented'); }
  get_topic<_t_ = unknown>(_topic: string | RegExp): Observable<pubsub_message<_t_>> { throw new Error('not-implemented'); }
  publish(_topic: string, _msg?: unknown, _async?: false) { throw new Error('not-implemented'); }
  readonly client_id!: string;
}

export default new spa_pubsub_stub;