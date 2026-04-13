import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";

export class News extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    };
  }

  async updateNews(page) {
    try {
      this.setState({ loading: true });

      const pageSize = 20;
      const url = `https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=${pageSize}&page=${page}&apiKey=0ab8803f5572409db5201fe1dddeda4e`;

      const response = await fetch(url);
      const parsedData = await response.json();

      this.setState({
        articles: parsedData.articles || [],
        totalResults: parsedData.totalResults || 0,
        page: page,
        loading: false
      });
    } catch (error) {
      console.error("News fetch error:", error);
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    this.updateNews(1);
  }

  handlePrevClick = () => {
    if (this.state.page > 1) {
      this.updateNews(this.state.page - 1);
    }
  };

  handleNextClick = () => {
    const totalPages = Math.ceil(this.state.totalResults / 20);
    if (this.state.page < totalPages) {
      this.updateNews(this.state.page + 1);
    }
  };

  render() {
    const totalPages = Math.ceil(this.state.totalResults / 20);

    return (
      <div className="container my-3">
        <h2 className="text-center">NewsMonkey - Top Headlines</h2>
        {this.state.loading &&<Spinner/>}
        {this.state.loading && (
          <p className="text-center">Loading...</p>
        )}

        <div className="row">
          {this.state.articles.map((element) => (
            <div className="col-md-4 my-2" key={element.url}>
              <NewsItem
                title={element.title}
                description={element.description}
                imageUrl={
                  element.urlToImage
                    ? element.urlToImage
                    : "https://placehold.co/300x200?text=No+Image"
                }
                newsUrl={element.url}
              />
            </div>
          ))}
        </div>

        <div className="container d-flex justify-content-between my-3">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            &larr; Previous
          </button>

          <button
            disabled={this.state.page >= totalPages}
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
