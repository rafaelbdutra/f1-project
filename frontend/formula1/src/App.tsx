import React from 'react';
import './App.css';
import {ApolloClient, ApolloProvider, InMemoryCache, useQuery} from "@apollo/client";
import {QUERY_DRIVERS} from "./drivers/queries/queries";

const client = new ApolloClient({
  uri: 'http://localhost:8089/graphql',
  cache: new InMemoryCache(),
});

interface Driver {
  id: string;
  name: string;
  nationality: string;
}

interface DriversData {
  drivers: Driver[];
}

interface DriverVars {
  id: string;
}

function Drivers() {
  const { loading, error, data } = useQuery<DriversData>(QUERY_DRIVERS);

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;

  const driversParagraph = data.drivers.map(({ id, name }) => (
    <p>
      {id}: {name}
    </p>
  ));

  return (
    <React.Fragment>
      { driversParagraph }
    </React.Fragment>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Drivers />
    </ApolloProvider>
  );
}

export default App;
