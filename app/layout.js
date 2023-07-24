import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        {/* Contenu du header */}
        <h1>Mon Application</h1>
        <nav>
          <ul>
            <li>
              <a href="/">Accueil</a>
            </li>
            <li>
              <a href="/about">À propos</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
};

export default Layout;
