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
import useDebounce from "../hooks/debounce";
import intersectionObserver from "../hooks/intersectionObserver";

function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const loader = useRef(null);
  const [inputSearch, setInputSearch] = useState("");

  const some = useCallback(async(prop)=>{
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?t=${prop}&apikey=2cbbdc85`
      );
      const data = await response.json();
      data.title = data.Title
      console.log(data)
      //const res = await fetch(`https://vidsrc.xyz/embed/movie?imdb=${imdbID}`)
      console.log(data, "d")

      setMovies((prev)=>[data, ...prev]);
    } catch (error) {
      console.error("Error fetching movies:", error);
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
        const dataPosterMovie = await fetch(`http://www.omdbapi.com/?i=${movie.imdb_id}&apikey=2cbbdc85`)
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
  intersectionObserver(loader, setPage)
  const handle=(e)=>{
    console.log(e.target.value)
    setInputSearch(e.target.value)
    debounce(e.target.value)
  }
  useEffect(() => {
    fetchMovies(page);
  }, [page]);
  console.log(movies == false);
  return (
    <div className="">
      <header class="header ">
        <h1 className="text-black font-bold text-2xl">Watch Movies Online</h1>
        <nav class="header-right">
          <Search handle={handle} value={inputSearch}/>
          <input 
          type="text"
           onChange={(e)=>{setInputSearch(e.target.value)}}
            value={"dvcewfvw"}
            />
          <a href="#contact">Contact</a>
          <a href="#about">About</a>
        </nav>
      </header>
      <div className="grid gap-[10px] justify-evenly grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
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
