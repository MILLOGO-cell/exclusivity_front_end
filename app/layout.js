import React, { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
const Layout = ({ children }) => {
  const [activeTab, setActiveTab] = useState("explorer");

  return (
    <div>
      <Navigation />
      <div className="content">{children}</div>
      <style jsx>{`
        .content {
          padding: 20px;
        }
      `}</style>
    </div>
  );
};
export default Layout;
