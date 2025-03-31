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

function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const loader = useRef(null);
  const [inputSearch, setInputSearch] = useState("");
  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=2cbbdc85`);
      const data = await response.json();
      return { ...data, embed_url: `https://player.vidsrc.co/embed/movie/${imdbID}` };
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  };

  const some = useCallback(async(prop)=>{
    if (!prop) return;
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${prop}&apikey=2cbbdc85`);
      const data = await response.json();
      if (data.Search) {
        const movieDetails = await Promise.all(
          data.Search.map(async (movie) => await fetchMovieDetails(movie.imdbID))
        );
        setMovies(movieDetails.filter((movie) => movie !== null));
      }
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  },[])
  const debounce = useDebounce(some, 2000)

  const fetchMovies = async (page) => {
    try {
      const response = await fetch(
        `https://vidsrc.xyz/movies/latest/page-${page}.json`
      );
      const data = await response.json(); 
      console.log(data)
      data.result.map(async(movie)=>{
        const dataPosterMovie = await fetch(`https://www.omdbapi.com/?i=${movie.imdb_id}&apikey=2cbbdc85`)
        console.log(dataPosterMovie.json().then((res)=>{
          console.log(res, movie)
          
          setMovies((prevMovies)=>[...prevMovies, {
            Poster:res.Poster,
            title:movie.title,
            embed_url:movie.embed_url,
            imdb_id:movie.imdb_id
          }])

        }))
      })
      
    } catch (error) {
      console.error("Error fetching movies:", error);
      
    }
  };
  useHook(loader, setPage)
  const handle = (e) => {
    const value = e.target.value;
    setInputSearch(value);
  
    if (value.trim() === "") {
      setPage(1); 
      setMovies([]); 
      fetchMovies(1); 
    } else {
      debounce(value);
    }
  };
  useEffect(() => {
    fetchMovies(page);
  }, [page]);
  console.log(movies == false);
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header class="flex  flex-col md:flex-row items-center justify-between items-center py-4 border-b border-gray-700 ">
        <h1 className="text-white font-bold text-2xl">Watch Movies Online</h1>
        <nav class="header-right align-middle items-center  flex gap-4 mt-4 md:mt-0 sm:gap-4">
          <Search handle={handle} value={inputSearch}/>
          <span className="flex gap-8 md:gap-4">    <a href="#contact">Contact</a>
          <a href="#about">About</a></span>
      
        </nav>
      </header>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mt-6">
        {movies.length > 0
          ? movies.map((movie, index) => (
              <Box
                href={movie?.embed_url}
                id={movie?.imdb_id}
                key={index}
                title={movie?.title}
                src={movie?.Poster}
              />
            ))
          : new Array(20).fill("").map((some, index) => (
              <div key={index} className="flex flex-col">
                <Skeleton variant="circular" width={200} height={140} />
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
