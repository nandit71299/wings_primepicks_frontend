import React from "react";

import styles from "./ErrorPage.module.css";
import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  return (
    <div className={styles.errorContainer}>
      <h1>Error: {error?.message || "An unexpected error occurred"}</h1>
    </div>
  );
}

export default ErrorPage;
