import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = {value: 'default', storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const {contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
    // this.handleChange = this.handleChange.bind(this);
  };

  handleChange = async (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = async (event) => {
    // alert('A name was submitted: ' + this.state.value);

    event.preventDefault();

    const { accounts, contract } = this.state;

    let x = Number(this.state.value);
    
    if(isNaN(x))alert('Not a number');
    else {
      if(window.confirm("Are you sure?")){
        await contract.methods.set(x).send({ from: accounts[0] });
        window.location.reload();
      }
      else {
        window.location.reload();
      }
    }
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        
        
        <p>
          If your contracts compiled and migrated successfully, you can store any value you want.<br></br>
          The defalut value will be zero.
        </p>

        <form onSubmit={this.handleSubmit}>
        <label>
          Enter the value to store : 
          <input type="text" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
        <br></br>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
