"use client"; // remove this line if you choose Pages Router

import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const dataProvider = simpleRestProvider("/api");

const AdminApp = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="recipes"
      list={ListGuesser}
      edit={EditGuesser}
      recordRepresentation="name"
    />
  </Admin>
);

export default AdminApp;
