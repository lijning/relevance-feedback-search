import React from "react";
import "./App.css";
import SearchPage from "./SearchPage";
import { Header, Container } from "semantic-ui-react";

function App() {
  return (
    <Container className="App">
      <Header as="h1" color="brown" style={{marginTop:25}}>
        Relevance-feedback Enhanced Search
      </Header>
      <SearchPage></SearchPage>
    </Container>
  );
}

export default App;
