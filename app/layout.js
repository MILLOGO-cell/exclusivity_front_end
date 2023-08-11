import React from "react";
import Link from "next/link";

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        {/* Contenu du header */}
        <h1>Mon Application</h1>
        <nav>
          <ul>
            <li>
              <Link href="/">
                <a>Accueil</a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a>À propos</a>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <a>Contact</a>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
};

export default Layout;
