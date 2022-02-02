import * as React from "react";

import { DefaultButton } from "@fluentui/react";

const InputEnvironment = ({ onSave }) => {
  const [env, setEnv] = React.useState("techosystems");
  const [username, setUsername] = React.useState("lyle.quesada");
  const [password, setPassword] = React.useState("Lylerman!1");

  const click = () => {
    onSave({
      env,
      username,
      password,
    });
  };

  return (
    <main className="ms-welcome__main">
      <input type="text" placeholder="Creatio environment" value={env} onChange={(e) => setEnv(e.target.value)} />
      <br />
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <DefaultButton className="ms-welcome__action" iconProps={{ iconName: "ChevronRight" }} onClick={click}>
        Run
      </DefaultButton>
    </main>
  );
};

export default InputEnvironment;
