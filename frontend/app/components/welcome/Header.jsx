import React from 'react';

export function Header() {
  return (
    <header className="mb-3">
      <div>
        <a
          className="text-white text-decoration-none float-md-start fw-bold fs-4"
          href="/"
        >
          Blacking
        </a>
        <nav className="nav nav-masthead justify-content-center float-md-end">
          <a className="nav-link fw-bold py-1 px-0" href="/about">
            О проекте
          </a>
          <a className="nav-link fw-bold py-1 px-0" href="/contacts">
            Контакты
          </a>
          <a className="nav-link fw-bold py-1 px-0" href="/FAQ">
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}
