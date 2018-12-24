import React from "react";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";

export class EditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.item.name || "",
      email: props.item.email || ""
    };
  }

  handleNameChange = e => {
    e.preventDefault();
    this.setState({
      name: e.target.value
    });
  };

  handleEmailChange = e => {
    e.preventDefault();
    this.setState({
      email: e.target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit({
      id: this.props.item.id,
      data: {
        name: this.state.name,
        email: this.state.email,
      }
    });
  }

  render() {
    return (
      <>
        {this.props.saving ? <div>Saving...</div> : null}
        <form onSubmit={this.handleSubmit}>
          <Grid container direction="row" justify="center" alignItems="center">
            <div style={{ padding: 20 }}>
              <Grid direction="row" justify="center" alignItems="center">
                <FormControl>
                  <InputLabel>Name</InputLabel>
                  <Input value={this.state.name} onChange={this.handleNameChange} />
                </FormControl>
              </Grid>
            </div>
            <div style={{ padding: 20 }}>
              <Grid direction="row" justify="center" alignItems="center">
                <FormControl>
                  <InputLabel>Email</InputLabel>
                  <Input value={this.state.email} onChange={this.handleEmailChange} />
                </FormControl>
              </Grid>
            </div>
            <div style={{ padding: 20 }}>
              <Grid direction="row" justify="center" alignItems="center">
                <Button style={{ marginRight: 20 }} type="submit" variant="contained" color="primary">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={this.props.onCancel}
                >
                  Cancel
                </Button>
              </Grid>
            </div>
          </Grid>
        </form>
      </>
    );
  }
}
