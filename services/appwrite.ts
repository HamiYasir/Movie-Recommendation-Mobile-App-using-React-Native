import { Client, Databases, ID, Query } from "react-native-appwrite";
// track the searches made by the user

// The ! mark indicates that the value for id's will be in the .env files
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_COLLECTION_ID!;

// Setting up appwrite client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PROJECT_ID!)

const database = new Databases(client)

// Setting up database instance belonging to the above set up client

// query and movie are being passed as props
export const updateSearchCount = async (query: string, movie: Movie) => {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('searchTerm', query)
    ])

    console.log(result);

    // check if a record of that search has already been stored
    // if a document is found increment the searchCount field
    // if no document is found
        // create a new document in Appwrite database; initialize its count to 1
}