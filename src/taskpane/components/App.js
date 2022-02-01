import * as React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import InputEnvironment from "./InputEnvironment";
import Progress from "./Progress";

/* global require */

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      item: Office.context.mailbox.item,
      settings: null,
    };
  }

  componentDidMount() {
    this.setState({
      settings: {
        env: Office.context.roamingSettings.get("creatio_env"),
      },
    });

    Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, () => {
      this.setState({ item: Office.context.mailbox.item });
    });
  }

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    return (
      <div className="ms-welcome">
        <Header logo={require("./../../../assets/logo-filled.png")} title={this.props.title} message="Welcome" />
        {this.state.settings && this.state.settings.env ? (
          <div>{this.state.settings.env}</div>
        ) : (
          <InputEnvironment
            onSave={async (value) => {
              Office.context.roamingSettings.set("creatio_env", value);
              Office.context.roamingSettings.saveAsync((asyncResult) => {
                if (asyncResult.status == Office.AsyncResultStatus.Succeeded) {
                  this.setState({ settings: { env: value } });
                }                
              });
            }}
          />
        )}
      </div>
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
