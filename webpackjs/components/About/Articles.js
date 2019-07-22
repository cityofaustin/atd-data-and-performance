import React from "react";
import { articles } from "./articles-data.js";
import Card from "../Shared/Card";

const Articles = ({}) => (
  <div>
    <div className="row px-3 px-sm-0 mb-2">
      <h1>Articles & Blog Posts</h1>
    </div>
    <div className="row">
      {articles.map((article, i) => (
        <div className="col-md-4" key={`Article_${i}`}>
          <Card
            imageUrl={article.photo}
            linkUrl={article.url}
            text={article.title}
          />
        </div>
      ))}
    </div>
  </div>
);

export default Articles;
