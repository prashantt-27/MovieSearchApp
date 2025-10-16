import React, { useEffect, useState } from "react";
import { Film, Heart, Search, Trash2 } from "lucide-react";

interface MovieDetails {
  id: string;
  title: string;
  poster: string;
  year: string;
}

const App: React.FC = () => {
  const api = "e82ee2f3";
  const [movieData, setMovieData] = useState<MovieDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("avengers");
  const [favourite, setFavourite] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMovie = async (searchfor: string) => {
    setLoading(true);
    try {
      let res = await fetch(
        `https://www.omdbapi.com/?apikey=${api}&s=${searchfor}`
      );
      let data = await res.json();

      if (data.Search) {
        const movies: MovieDetails[] = data.Search.map((movie: any) => ({
          id: movie.imdbID,
          title: movie.Title,
          poster: movie.Poster,
          year: movie.Year,
        }));

        setMovieData(movies);
      }
    } catch (err) {
      console.log("error : ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie(searchQuery);
  }, [searchQuery]);

  const handleSearchClick = (): void => {
    fetchMovie(searchQuery);
  };

  const handleFavourite = (id: string) => {
    let fav = movieData.find((item) => item.id === id);

    if (fav && !favourite.find((item) => item.id === fav.id)) {
      setFavourite([...favourite, fav]);
    }
  };

  const handleDeleteFavourite = (id: string) => {
    setFavourite((prev: MovieDetails[]) => {
      const newList = prev.filter((item) => item.id !== id);
      return newList;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header with gradient overlay */}
      <div className="relative bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 pb-32 pt-12">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Film className="w-12 h-12" />
            <h1 className="text-6xl font-black tracking-tight">CINEMATIC</h1>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchClick()}
                className="w-full pl-12 pr-32 py-4 bg-white text-slate-900 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-pink-400 shadow-2xl"
              />
              <button
                onClick={handleSearchClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-8 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-full hover:from-red-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 -mt-20">
        {/* Search Results */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
            Search Results
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movieData.map((item) => (
              <div
                key={item.id}
                className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-pink-500 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      item.poster !== "N/A"
                        ? item.poster
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={item.title}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate group-hover:text-pink-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3">{item.year}</p>

                  <button
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      favourite.find((idx) => item.id === idx.id)
                        ? "bg-pink-600 text-white"
                        : "bg-slate-800 text-white hover:bg-pink-600"
                    }`}
                    onClick={() => handleFavourite(item.id)}
                    disabled={!!favourite.find((idx) => item.id === idx.id)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favourite.find((idx) => item.id === idx.id)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                    {favourite.find((idx) => item.id === idx.id)
                      ? "Added"
                      : "Add"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {movieData.length === 0 && (
            <div className="text-center py-20">
              <Film className="w-20 h-20 mx-auto mb-4 text-slate-700" />
              <p className="text-slate-400 text-xl">
                {loading ? "Loading..." : "No movies found. Try searching!"}
              </p>
            </div>
          )}
        </div>

        {/* Favourites Section */}
        <div className="pb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-red-500 rounded-full"></div>
            Your Favourites
            {favourite.length > 0 && (
              <span className="text-base font-normal text-slate-400">
                ({favourite.length})
              </span>
            )}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favourite.map((item) => (
              <div
                key={item.id}
                className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-red-500 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      item.poster !== "N/A"
                        ? item.poster
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={item.title}
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Heart className="w-6 h-6 text-pink-500 fill-current" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3">{item.year}</p>

                  <button
                    className="w-full py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2"
                    onClick={() => handleDeleteFavourite(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {favourite.length === 0 && (
            <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
              <Heart className="w-20 h-20 mx-auto mb-4 text-slate-700" />
              <p className="text-slate-400 text-xl">
                No favourites yet. Start adding movies you love!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
