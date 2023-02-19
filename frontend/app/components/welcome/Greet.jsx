import React from 'react';

export default function Greet() {
  return (
    <main className="align-center">
      <h1>Социальная сеть для IT</h1>
      <p className="lh-lg lead">
        Добро пожаловать на, возможно, первую социальную сеть, нацеленную на
        программистов, общайтесь, вступайте в группы и делитесь кодом!
      </p>
      <h4 className="lh-lg text-decoration-underline lead">
        Уже зарегистрированы? Нет? Тогда зарегистрируйтесь и вступайте в
        процветающее сообщество Blacking!
      </h4>
      <p className="lh-lg justify-content-center float-md-center">
        <a className="btn btn-lg btn-light me-3" href="/login">
          Войти
        </a>
        <a className="btn btn-lg btn-light ms-3" href="/register">
          Зарегистрироваться
        </a>
      </p>
    </main>
  );
}
