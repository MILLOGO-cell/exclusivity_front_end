import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/configs/api";
import Link from "next/link";

const Conditions = () => {
  const [conditionsContent, setConditionsContent] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/utilisateurs/conditions/`)
      .then((response) => {
        setConditionsContent(response.data.content);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des conditions :", error);
      });
  }, []);

  return (
    <div className="conditions-page">
      <nav className="navbar">
        <a href="/">
          <div className="logo">
            <img src="/logo.png" alt="Logo" />
          </div>
        </a>
      </nav>
      <div className="content-wrapper">
        <h1 className="title">Conditions d'utilisation</h1>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: conditionsContent }}
        />
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 1rem;
          background-color: #fff;
          color: white;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .logo {
          display: inline-block;
        }

        .logo img {
          width: 100px;
          height: 50px;
        }

        .content-wrapper {
          padding: 20px;
          max-width: 800px;
          margin: 70px auto; /* Ajustez la marge supérieure en fonction de la hauteur de la barre de navigation */
        }

        .title {
          font-size: 24px;
          text-align: center;
          margin-bottom: 20px;
        }

        .content {
          font-size: 16px;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .title {
            font-size: 20px;
          }

          .content {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Conditions;
