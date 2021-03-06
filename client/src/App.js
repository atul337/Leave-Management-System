import React, { Component } from "react";
import LeaveContract from "./contracts/Leave.json";
import getWeb3 from "./utils/getWeb3";
import InitialPage from "./components/InitialPage"
import AdminPage from "./components/AdminPage"
import UserPage from "./components/UserPage"

class App extends Component {
  state = {
    ok:false,
    adminDone : false, 
    web3: null, 
    accounts: null, 
    contract: null,
    adminAdress: '' ,
    userExist:false,
    maxleaves:0
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LeaveContract.networks[networkId];
      const instance = new web3.eth.Contract(
        LeaveContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      await this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.adminDone().call();
    const adminadd = await contract.methods.admin().call();
    const userexist = await contract.methods.userExists(accounts[0]).call();
    const ml = await contract.methods.max_leave().call();
    // const tempdetails = await contract.methods.curdetails(accounts[0]).call();

    // Update state with the result.
    await this.setState({ adminDone: response, adminAdress: adminadd, userExist:userexist, maxleaves:ml, ok:true});
    // console.log(this.state.userExist);
    // this.handleChange = this.handleChange.bind(this);
    // this.setState({ curName: tempdetails[0], curID: tempdetails[1], leavesRemain: (this.state.curmaxleave - tempdetails[2])});
  };

  render() {
    if (!this.state.web3) {
      return ("Waiting for injected web3!");
    }
    else if(!this.state.adminDone && this.state.ok){ 
      return( <InitialPage   accounts = {this.state.accounts} contract = {this.state.contract}/>);
    }
    // eslint-disable-next-line
    else if(this.state.accounts[0] == this.state.adminAdress ){
      return(<AdminPage   accounts = {this.state.accounts} contract = {this.state.contract}/>);
    }
    else if(this.state.userExist){
      return(<UserPage   accounts = {this.state.accounts} contract = {this.state.contract} maxleaves = {this.state.maxleaves}/>);
    }
    else if(this.state.ok) return(<div id = "noone"><h2>You are not registered yet. Contact Admin</h2></div>);
    else return (<div id = "noone"><h2>Loading.....</h2></div>);
  }
}

export default App;
