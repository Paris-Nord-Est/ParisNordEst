import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getProductsConf(): { [key: string]: string } {
    return {
      laBeige:
        'https://www.carnets-de-traverse.com/blog/wp-content/uploads/2014/10/Photo24_22A.jpg',
    };
  }
}
