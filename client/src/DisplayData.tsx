import React, { useState } from 'react';
import { useQuery, useLazyQuery, gql, useMutation } from '@apollo/client';

interface User {
    id: number
    name: string
    age: number
    username: string
    nationality: string
}

interface Movie {
    id: number
    name: string
    yearOfPublication: number
    isInTheaters: boolean
}

const QUERY_ALL_USERS = gql`
    query GetAllUsers {
        users {
            id
            name
            age
            username
            nationality
        }
    }
`;

const QUERY_ALL_MOVIES = gql`
    query GetAllMovies {
        movies {
            id
            name
            yearOfPublication
            isInTheaters
        }
    }
`;

const GET_MOVIE_BY_NAME = gql`
    query Movie($name: String!) {
        movie(name: $name) {
            name
            yearOfPublication
        }
    }
`;

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            name
            id
        }
    }
`;

const DELETE_USER_MUTATION = gql`
    mutation($deleteUserId: ID!) {
        deleteUser(id: $deleteUserId) {
            id
        }
    }
`;

const DisplayData = () => {
    const [movieSearched, setMovieSearched] = useState<string>("");

    // Create User States
    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [age, setAge] = useState<number>(0);
    const [nationality, setNationality] = useState<string>("");

    const { data, loading, refetch } = useQuery(QUERY_ALL_USERS);
    const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
    const [
        fetchMovie, 
        {data: movieSearchedData, error: movieError}, 
    ] = useLazyQuery(GET_MOVIE_BY_NAME);

    const [createUser] = useMutation(CREATE_USER_MUTATION);

    const [deleteUser] = useMutation(DELETE_USER_MUTATION);
    
    if (loading) return <h1>DATA IS LOADING...</h1>
    if (movieError) console.log(movieError);
    
    return (
        <div>
            <div>
                <input 
                    type="text" 
                    placeholder="Name..."
                    onChange={(e) => { setName(e.target.value) }}
                />
                <input 
                    type="text" 
                    placeholder="Username..."
                    onChange={(e) => { setUsername(e.target.value) }}
                />
                <input 
                    type="number" 
                    placeholder="Age..."
                    onChange={(e) => { setAge(parseInt(e.target.value)) }}
                />
                <input 
                    type="text" 
                    placeholder="Nationality..."
                    onChange={(e) => { setNationality(e.target.value.toUpperCase()) }}
                />
                <button onClick={() => { 
                    createUser({
                        variables: { input: { name, username, age: Number(age), nationality } },
                    });
                    refetch(); 
                    }}
                >
                    Create User
                </button>
            </div>
            {data && data.users.map((user: User) => {
                return (
                    <div>
                        <h1>Name: {user.name}</h1>
                        <h1>Username: {user.username}</h1>
                        <h1>Age: {user.age}</h1>
                        <h1>Nationality: {user.nationality}</h1>
                        <button 
                            onClick={() => { 
                                deleteUser({
                                    variables: {
                                         deleteUserId: user.id
                                    }
                                });
                                refetch(); 
                            }
                        }>
                            delete: {user.id}
                        </button>
                    </div>
                )
            })}
            {/* {movieData && movieData.movies.map((movie : Movie) => {
                return (
                    <h1>Movie Name: {movie.name}</h1>
                )
            })} */}

            <div>
                <input 
                    type="text" 
                    placeholder="Interstellar..."
                    onChange={(event) => {
                        setMovieSearched(event.target.value)
                    }}
                />
                <button 
                    onClick={() => { 
                        fetchMovie({ 
                            variables : {
                                name: movieSearched,
                            },
                        }) 
                    }}
                >
                    Fetch Data
                </button>
                <div>
                    {movieSearchedData && (
                        <div>
                            {" "}
                            <h1>MovieName: {movieSearchedData.movie.name}</h1>{" "}
                            <h1>Year Of Publication: {movieSearchedData.movie.yearOfPublication}</h1>{" "}                        
                        </div>
                    )}
                    {movieError && <h1>There was an error fetching the data</h1>}
                </div>
            </div>
        </div>
    )
}

export default DisplayData
