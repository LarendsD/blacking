import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome() {
    return { title: 'Добро пожаловать!' };
  }

  getAbout() {
    return { title: 'О проекте' };
  }

  getContacts() {
    return { title: 'Контакты' };
  }

  getFAQ() {
    return { title: 'FAQ' };
  }

  getRegisterPage() {
    return { title: 'Register' };
  }

  getLoginPage() {
    return { title: 'logIn' };
  }
}
