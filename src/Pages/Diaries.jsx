import React from "react";
import Layout from "../Layout/MainLayout";

function Diaries() {
  return (
    <Layout>
      <article aria-labelledby="diaries-title">
        <header>
          <h2 id="diaries-title">Diarios</h2>
        </header>
        <p>
          Pasan cosas y cosas pasan, pero de diarios.
        </p>
      </article>
    </Layout>
  );
}

export default Diaries;
