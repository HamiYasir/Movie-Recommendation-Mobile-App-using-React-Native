import { Client, Databases, ID, Query } from "react-native-appwrite";
// track the searches made by the user

// The ! mark indicates that the value for id's will be in the .env files
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

// Setting up appwrite client
const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setPlatform('com.hamiyasir.flickly');

const database = new Databases(client);

// Setting up database instance belonging to the above setup client

// query and movie are being passed as props
export const updateSearchCount = async (query: string, movie: Movie) => {
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal("searchTerm", query)
        ]);

        // Creating document
        // Check if a record of that search has already been stored
        if(result.documents.length > 0){
            // Returns the top most result for that search query to the variable existingMovie
            const existingMovie = result.documents[0];

            // update the database
            await database.updateDocument(
                DATABASE_ID, // The database to be updated
                COLLECTION_ID, // Within which collection to update
                existingMovie.$id, //The id which has to be updated
                {
                    count: existingMovie.count + 1, // automatic count updation
                }
            );
            // If it does not already exist, create a new record
        }else{
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                // This is how the object of the newly created record will look like
                searchTerm: query,
                movie_id: movie.id,
                title: movie.title,
                count: 1,
                poster_url: `https://image.tdmb.org/t/p/w500${movie.poster_path}`
            });
        }

        console.log(result)
    }catch (error) {
        console.log(error);
        throw error;
    }
};

export const getTrendingMovies = async(): Promise<TrendingMovie[] | undefined> => {
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5), // Get first 5 limits
            Query.orderDesc('count'), // Return movies based on count in descending order
        ]);

        // 'as unknown as' lets typescript know the exact return type of the document
        return result.documents as unknown as TrendingMovie[];
    }catch(error){
        console.log(error);
        throw error;
        return undefined;
    }
};