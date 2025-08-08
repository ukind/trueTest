import axiosClient from '../../api/axiosClient';
import { CatalogueEndpoint } from '../../api/endpoints';
import { type Search } from './types';

export default class SearchService {
  static async findSuggestion(Payload: Search.getMovies.Payload) {
    const response = await axiosClient.get<Search.getMovies.Response>(
      CatalogueEndpoint.getSuggestion,
      {
        params: Payload,
      }
    );
    return response.data;
  }

  static async searchMovies(Payload: Search.getMovies.Payload) {
    const response = await axiosClient.get<Search.getMovies.Response>(
      CatalogueEndpoint.searchMovie,
      {
        params: Payload,
      }
    );
    return response.data;
  }

  static async getMoviesDetail(Payload: Search.getMovies.Payload) {
    const response = await axiosClient.get<Search.getMovies.Response>(
      CatalogueEndpoint.getMovieDetail,
      {
        params: Payload,
      }
    );
    return response.data;
  }
}
