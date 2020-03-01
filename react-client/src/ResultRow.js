import React, { Component } from "react";
import { Segment, Header, Grid, Radio } from "semantic-ui-react";

export default class ResultRow extends Component {
  render() {

    return (
      <Segment>
        <Grid columns={2}>
          <Grid.Column width={12}>
            <Header as="h3">{this.props.title}</Header>
            <a href={this.props.url}>{this.props.url}</a>
            <p>{this.props.summary}</p>
          </Grid.Column>
          <Grid.Column width={3}>
            <p>relevant?</p>
            {/* {this.props.isRelevant ? (
              <Radio
                // checked
                toggle
                onClick={() => this.props.onRadioChange()}
              />
            ) : (
              <Radio toggle onClick={() => this.props.onRadioChange()} />
            )} */}
            <Radio toggle checked={this.props.isRelevant} onClick={() => this.props.onRadioChange()} />
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}
