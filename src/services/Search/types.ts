export namespace Search {
  export interface BasePayload {
    type: 'movie' | 'series' | 'episode';
    y?: number; //year of release
    plot?: 'short' | 'full';
  }

  export namespace getMovies {
    export interface Payload extends BasePayload {
      s: string;
      page: number;
    }

    export interface Response {
      Search?: SearchEntity[] | null;
      totalResults: string;
      Response: string;
    }
    export interface SearchEntity {
      Title: string;
      Year: string;
      imdbID: string;
      Type: string;
      Poster: string;
    }
  }

  export namespace getMovieDetail {
    export interface Payload extends Pick<BasePayload, 'plot'> {
      i: string;
    }

    export interface Response {
      Title: string;
      Year: string;
      Rated: string;
      Released: string;
      Runtime: string;
      Genre: string;
      Director: string;
      Writer: string;
      Actors: string;
      Plot: string;
      Language: string;
      Country: string;
      Awards: string;
      Poster: string;
      Ratings?: RatingsEntity[] | null;
      Metascore: string;
      imdbRating: string;
      imdbVotes: string;
      imdbID: string;
      Type: string;
      DVD: string;
      BoxOffice: string;
      Production: string;
      Website: string;
      Response: string;
    }
    export interface RatingsEntity {
      Source: string;
      Value: string;
    }
  }
}
