import { useState, useEffect } from "react";
import {View, Text, Image, FlatList, ActivityIndicator} from "react-native";

import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";

import MovieCard from "@/components/movieCard";
import SearchBar from "@/components/searchBar";


const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const {
        data: movies,
        loading,
        error,
        refetch: loadMovies,
        reset,
    } = useFetch(() => fetchMovies({
        query: searchQuery
    }), false);
    // Here, a second argument false is passed because we don't want to autoFetch movies

    // Defining a debounce so that when a movie is searched for, we don't search every movie for each letter in the movie name
    // The debounce will make it so that movie results are only searched after 500 ms are passed
    useEffect(() => {
        const timeoutId = setTimeout(async() => {
            if(searchQuery.trim()){
                await loadMovies();
            }else{
                reset();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // This will change when movies themselves change
    useEffect(() => {
        // Call updateSearchCount only if there are results
        if(movies?.length! > 0 && movies?.[0])
            updateSearchCount(searchQuery, movies[0]);
    }, [movies]);

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover"/>

            {/*Anything rendered inside ListHeaderComponent will be always at the top of the FlatList. Perfect for our SearchBar*/}
            <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item}/>}
                keyExtractor={(item) => item.id.toString()}
                className="px-5"
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 16,
                    marginVertical: 16
                }}
                contentContainerStyle={{
                    paddingBottom: 100
                }}
                ListHeaderComponent={
                    <>
                        <View className="w-full flex-row justify-center mt-20 items-center">
                            <Image source={icons.logo} className="w-12 h-10"/>
                        </View>

                        <View className="my-5">
                            <SearchBar
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChangeText={(text: string) => setSearchQuery(text)}
                            />
                        </View>

                        {loading && (
                            <ActivityIndicator size="large" color="#0000ff" className="my-3"/>
                        )}

                        {error && (
                            <Text className="text-red-500 px-5 my-3">
                                Error: {error.message}
                            </Text>
                        )}

                        {!loading && !error && searchQuery.trim() && movies?.length! > 0 && (
                            <Text className="text-xl text-white font-bold">
                                Search Results for {" "}
                                <Text className="text-accent">{searchQuery}</Text>
                            </Text>
                        )}
                    </>
                }
                // ListEmptyComponent what renders when nothing is returned by the list
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-500">
                                {searchQuery.trim() ? 'No movies found' : 'Search for a movie'}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    )
}

export default Search;