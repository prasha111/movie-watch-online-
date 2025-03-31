"use client";
import Image from "next/image";
import { useCallback, useRef } from "react";
import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import Box from "@/components/box";
import useIntersectionObserver from "@/components/infinitescroll";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Search from "@/components/search";
import useDebounce from "./hooks/debounce";
import useHook from "./hooks/intersectionObserver";

import { Helmet } from "react-helmet";
const SEO = ({ title, description }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content="index, follow" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
  </Helmet>
);


function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const loader = useRef(null);
  const [inputSearch, setInputSearch] = useState("");

  const fetchMovieDetails = async (imdbID) => {
    const cachedMovie = localStorage.getItem(`movie-${imdbID}`);
    if (cachedMovie) return JSON.parse(cachedMovie);

    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=2cbbdc85`);
      const data = await response.json();
      const movieData = { ...data, embed_url: `https://player.vidsrc.co/embed/movie/${imdbID}` };
      localStorage.setItem(`movie-${imdbID}`, JSON.stringify(movieData)); // Cache it
      return movieData;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  };

  const searchMovies = useCallback(async (query) => {
    if (!query) return;

    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=2cbbdc85`);
      const data = await response.json();
      if (data.Search) {
        const movieDetails = await Promise.all(
          data.Search.map(async (movie) => await fetchMovieDetails(movie.imdbID))
        );
        setMovies(movieDetails.filter(Boolean));
      }
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  }, []);

  const debouncedSearch = useDebounce(searchMovies, 1500);

  const fetchMovies = async (pageNum) => {
    try {
      const response = await fetch(`https://vidsrc.xyz/movies/latest/page-${pageNum}.json`);
      const data = await response.json();

      const moviesData = await Promise.all(
        data.result.map(async (movie) => {
          const res = await fetchMovieDetails(movie.imdb_id);
          return res
            ? {
                Poster: res.Poster,
                title: movie.title,
                embed_url: movie.embed_url,
                imdb_id: movie.imdb_id,
              }
            : null;
        })
      );

      setMovies((prevMovies) => [...prevMovies, ...moviesData.filter(Boolean)]);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useHook(loader, setPage);

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

 
  const handleSearch = (e) => {
    const value = e.target.value;
    setInputSearch(value);

    if (value.trim() === "") {
      setPage(1);
      setMovies([]);
      fetchMovies(1);
    } else {
      debouncedSearch(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
    <SEO title="Watch Movies Online | Movie Watch" description="Stream movies online in HD quality. No registration required." />
    <header className="flex flex-col md:flex-row items-center justify-between py-4 border-b border-gray-700">
      <h1 className="text-white font-bold text-2xl">Watch Movies Online</h1>
      <nav className="header-right flex gap-4 mt-4 md:mt-0 sm:gap-4">
        <Search handle={handleSearch} value={inputSearch} />
        <span className="flex gap-8 md:gap-4">
          <a href="#contact">Contact</a>
          <a href="#about">About</a>
        </span>
      </nav>
    </header>
    <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mt-6">
      {movies.length > 0
        ? movies.map((movie, index) => (
            <Box key={index} href={movie.embed_url} id={movie.imdb_id} title={movie.title} src={movie.Poster} />
          ))
        : new Array(20).fill("").map((_, index) => (
            <div key={index} className="flex flex-col">
              <Skeleton width={200} height={140} />
              <span>
                <Skeleton width={190} height={10} />
              </span>
            </div>
          ))}
    </div>

    <div ref={loader} />
  </div>
  );
}


export default Home;
