import * as React from "react";
import PropTypes from "prop-types";

import { DefaultButton } from "@fluentui/react";

export default class InputEnvironment extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      envInput: "",
    };
  }

  click = (value) => {
    this.props.onSave(this.state.envInput);
  };

  render() {
    const { onSave } = this.props;

    return (
      <main className="ms-welcome__main">
        <input type="text" value={this.state.envInput} onChange={(e) => this.setState({ envInput: e.target.value })} />
        <DefaultButton className="ms-welcome__action" iconProps={{ iconName: "ChevronRight" }} onClick={this.click}>
          Run
        </DefaultButton>
      </main>
    );
  }
}

InputEnvironment.propTypes = {
  onSave: PropTypes.func,
};
