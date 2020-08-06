import React from "react";
import { Profile } from "./profile/profile";
import user from "./libery/user.json";
import { Statistics } from "./statistics/statistics";
import statisticsdata from "./statistics/statistics-data.json";
import FriendListData from "./FriendList/FriendListData.json";
import { FriendListFunk } from "./FriendList/FriendList";
import transactions from "./TransactionHistory/transactions.json";
import { TransHistory } from "./TransactionHistory/TransactionHistory";

function App() {
  return (
    <div className="App">
      <Profile user={user}></Profile>
      <Statistics statistiks={statisticsdata}></Statistics>
      <FriendListFunk friend={FriendListData}></FriendListFunk>
      <TransHistory items={transactions}></TransHistory>
    </div>
  );
}

export default App;
