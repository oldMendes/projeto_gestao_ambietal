import { v4 as uuidV4 } from 'uuid';

class Category {

  id?: string;
  name: string;
  description: string;
  created_at: Date;

  // metodo que é chamado quando a classe é instanciada
  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }

}

export { Category };