import { firstValueFrom } from 'rxjs';
import { spa_util_http } from './http';

export class spa_util_mime_type_svc {
  constructor(protected http: spa_util_http = new spa_util_http()) {
  }

  get_mime_types(): PromiseLike<string[]> {
    if(this.list === undefined) {
      this.list = firstValueFrom(this.http.get<string[]>('/api/data/mime-type/$all'));
    }
    return this.list;
  }

  private list?: PromiseLike<string[]>;
}

export default new spa_util_mime_type_svc();