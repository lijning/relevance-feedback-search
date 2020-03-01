import React from "react";
import SearchBar from "./SearchBar";
import {
  List,
  Container,
  Header,
  Message,
  Form,
  Input,
  Button
} from "semantic-ui-react";
import ResultRow from "./ResultRow";

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      query: "Rocchio Algorithm",
      results: [
        {
          idx: 0,
          url: "",
          title: "Search results will be shown here",
          summary: "",
          isRelevant: false
        }
      ],
      attempts: 0,
      key: "****aS*******a**vxSY991zB",
      cx: "001155980652667309729:bgrnl8tabzj"
    };
  }

  handleRadioChange(idx) {
    const copyResults = this.state.results;
    const relevance = copyResults[idx].isRelevant;
    copyResults[idx].isRelevant = relevance ? false : true;
    this.setState({
      results: copyResults
    });
  }

  updateQuery(content) {
    this.setState({ query: content });
  }

  fetchSearchResults() {
    const url = `https://www.googleapis.com/customsearch/v1?q=${this.state.query}&cx=${this.state.cx}&key=${this.state.key}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const items = data.items;
        if (!items) {
          const msg = data.error.message ? data.error.message : "Bad Request";
          this.setState({ msg });
        } else {
          const results = items.map((ele, idx) => {
            return {
              idx,
              title: ele.title,
              url: ele.link,
              summary: ele.snippet,
              isRelevant: false
            };
          });
          this.setState({
            msg: null,
            results: results,
            attempts: this.state.attempts + 1
          });
        }
      });
  }

  renderRow(idx) {
    const item = this.state.results[idx];
    return (
      <ResultRow
        title={item.title}
        summary={item.summary}
        url={item.url}
        isRelevant={item.isRelevant}
        onRadioChange={() => this.handleRadioChange(idx)}
      ></ResultRow>
    );
  }

  fetchEnhancedQuery() {
    const url = "/api/algorithm/rocchio";
    const dataItems = this.state.results.map(ele => {
      return {
        text: ele.summary,
        relevant: ele.isRelevant ? true : false
      };
    });
    const data = {
      query: this.state.query,
      items: dataItems
    };
    const wrapped = JSON.stringify(data);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const req = new Request(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "omit", // include, *same-origin, omit
      headers: headers,
      body: wrapped // body data type must match "Content-Type" header
    });

    fetch(req)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log("Success:", data);
        const updatedQuery = data.result;
        this.setState({ query: updatedQuery });
      })
      .catch(error => {
        console.error("Error:", error);
      });
    // this.setState({ attempts: this.state.attempts + 1 });
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmitCredentials = e => {
    const cx = e.target.elements.cx.value,
      key = e.target.elements.key.value;
    this.setState({ cx, key });
  };
  //             ref="cxField"
  //             ref='keyField'

  renderForm() {
    return (
      <Form onSubmit={this.handleSubmitCredentials}>
        <Form.Group widths="equal">
          <Form.Field
            name="cx"
            control={Input}
            label="Custome Search Engine ID"
            placeholder={this.state.cx}
          />
          <Form.Field
            name="key"
            control={Input}
            label="JSON API key"
            placeholder={this.state.key}
          />
        </Form.Group>

        <Form.Field
          id="form-button-public"
          control={Button}
          content="Confirm"
        />
      </Form>
    );
  }

  render() {
    const results = this.state.results;
    const listItems = results.map(item => (
      <List.Item key={item.idx}>{this.renderRow(item.idx)}</List.Item>
    ));
    return (
      <div>
        <Container style={{ marginTop: 15 }}>
          <SearchBar
            query={this.state.query}
            onTextChange={text => this.updateQuery(text)}
            onClickSearch={() => this.fetchSearchResults()}
            onClickUpdate={() => this.fetchEnhancedQuery()}
            isFirst={this.state.attempts === 0}
          ></SearchBar>
          <Message warning hidden={!this.state.msg} content={this.state.msg} />

          <Header as="h2">Search Results</Header>
          <p>Tick all the relevant results...</p>
          <List>{listItems}</List>
          {this.renderForm()}
        </Container>
      </div>
    );
  }
}

export default SearchPage;
