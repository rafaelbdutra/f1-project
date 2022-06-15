import {gql} from "@apollo/client";

export const QUERY_DRIVERS = gql`
  query GetDrivers {
    drivers {
      id
      name
    }
  }
`;

export const QUERY_DRIVER = gql`
  query GetDriver($id: String) {
    driver(id: $id) {
      name
      nationality
    }
  }
`;