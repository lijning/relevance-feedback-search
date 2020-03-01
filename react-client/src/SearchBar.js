import React, { Component } from "react";
import { Input, Button } from "semantic-ui-react";

export default class SearchBar extends Component {
  renderUpdateButton() {
    if (this.props.isFirst === false) {
      return (
        <Button
          onClick={() => {
            this.props.onClickUpdate();
          }}
        >
          {" "}
          Update Query{" "}
        </Button>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div>
        <Input
          style={{ width: "60%" }}
          placeholder={this.props.query}
          onChange={e => {
            this.props.onTextChange(e.target.value);
          }}
        ></Input>{" "}
        <Button
          onClick={() => {
            this.props.onClickSearch();
          }}
        >
          Search!
        </Button>
        {this.renderUpdateButton()}
      </div>
    );
    //         <Button> {this.props.isFirst? null : "Update Query" } </Button>
  }
}
