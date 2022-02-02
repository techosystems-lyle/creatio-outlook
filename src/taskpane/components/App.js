import * as React from "react";
import Header from "./Header";
import InputEnvironment from "./InputEnvironment";
import Progress from "./Progress";
import { DefaultButton } from "@fluentui/react";

import axios from "axios";

/* global require */

const App = ({ title, isOfficeInitialized }) => {
  const [item, setItem] = React.useState(Office.context.mailbox.item);
  const [settings, setSettings] = React.useState({
    env: Office.context.roamingSettings.get("creatio_env"),
    username: Office.context.roamingSettings.get("username"),
    password: Office.context.roamingSettings.get("password"),
  });
  const [response, setResponse] = React.useState(null);

  const axiosInstance = axios.create({
    baseURL: `https://${settings.env}.creatio.com`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'ForceUseSession': 'true'
    }
  });

  React.useEffect(() => {
    Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, () => {
      setItem(Office.context.mailbox.item);
    });
  }, []);

  const tryLogin = ({ env, username, password }) => {
    axiosInstance
      .post("/ServiceModel/AuthService.svc/Login", {
        UserName: username,
        UserPassword: password,
      })
      .then(function (response) {
        setSettings({ ...settings, env, username, password });
        setResponse(response.toString());
      })
      .catch(function (error) {        
        setResponse(error.toString());
      });
  };

  return (
    <React.Fragment>
      {!isOfficeInitialized ? (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your addin to see app body."
        />
      ) : (
        <div className="ms-welcome">
          <Header logo={require("./../../../assets/logo-filled.png")} title={title} message="Welcome" />
          {item.from.emailAddress}
          <br />
          {response}
          <br/>
          {settings.env != null ? (
            <div>
              {settings.env}
              <br />
              <br />
              {settings.username}
              <br />
              {settings.password}
              <br />
              <br />
              <DefaultButton
                className="ms-welcome__action"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => {
                  Office.context.roamingSettings.remove("creatio_env");
                  Office.context.roamingSettings.remove("username");
                  Office.context.roamingSettings.remove("password");

                  Office.context.roamingSettings.saveAsync((asyncResult) => {
                    if (asyncResult.status == Office.AsyncResultStatus.Succeeded) {
                      setSettings({ ...settings, env: null, username: null, password: null });
                    }
                  });
                }}
              >
                Clear settings
              </DefaultButton>
            </div>
          ) : (
            <InputEnvironment
              onSave={async ({ env, username, password }) => {
                Office.context.roamingSettings.set("creatio_env", env);
                Office.context.roamingSettings.set("username", username);
                Office.context.roamingSettings.set("password", password);

                Office.context.roamingSettings.saveAsync((asyncResult) => {
                  if (asyncResult.status == Office.AsyncResultStatus.Succeeded) {
                    tryLogin(settings);
                  }
                });
              }}
            />
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default App;
