import React from "react";
import { Profile } from "./profile/profile";
import user from "./libery/user.json";

function App() {
  return (
    <div className="App">
      <Profile user={user}></Profile>
    </div>
  );
}

export default App;
