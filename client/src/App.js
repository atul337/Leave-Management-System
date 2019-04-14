import React, { Component } from "react";
import LeaveContract from "./contracts/Leave.json";
import getWeb3 from "./utils/getWeb3";
import InitialPage from "./components/InitialPage"
import AdminPage from "./components/AdminPage"
import UserPage from "./components/UserPage"

class App extends Component {
  state = {
    adminDone : false, 
    Name: '', 
    EmpID: '', 
    EmpAddress:'',
    web3: null, 
    accounts: null, 
    contract: null,
    leaveDays:'',
    adminAdress: '' ,
    newadminAdress:'',
    maxleave:'',
    curName: '',
    curID:'',
    leavesRemain:'',
    curmaxleave:''
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
    const {accounts,contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.admindone().call();
    const adminadd = await contract.methods.admin().call();
    const tempdetails = await contract.methods.curdetails(accounts[0]).call();
    const tempml = await contract.methods.max_leave().call();

    // Update state with the result.
    this.setState({ adminDone: response, adminAdress: adminadd, curmaxleave : tempml});
    // this.handleChange = this.handleChange.bind(this);
    this.setState({ curName: tempdetails[0], curID: tempdetails[1], leavesRemain: (this.state.curmaxleave - tempdetails[2])});


  };

  handleName = async (event) => {
    this.setState({Name: event.target.value});
  }
  handleEmpID = async (event) => {
    this.setState({EmpID: event.target.value});
  }
  handleEmpAddress = async (event) => {
    this.setState({EmpAddress: event.target.value});
  }

  handleleaveDays = async (event) => {
    this.setState({leaveDays: event.target.value});
    // console.log(this);
  }

  handleNewAdmin = async (event) => {
    this.setState({newadminAdress:event.target.value});
  }

  handleAdminChange = async (event) => {
    // alert('A name was submitted: ' + this.state.value);

    event.preventDefault();

    const { accounts, contract } = this.state;

    if(window.confirm("Change Admin?")){
     
      await contract.methods.changeadmin(this.state.newadminAdress).send({ from: accounts[0] });
      window.location.reload();
    }
    else {
      window.location.reload();
    }
    
  }
  handleMaxleave = async (event) => {
    this.setState({maxleave: event.target.value});
  }

  handleSetMaxleave = async (event) => {
    event.preventDefault();

    const { accounts, contract } = this.state;

    if(window.confirm("Set max leave?")){
     
      await contract.methods.setmaxleave(this.state.maxleave).send({ from: accounts[0] });
      window.location.reload();
    }
    else {
      window.location.reload();
    }
    
  }

  handleFetchDetails = async (event) => {
    event.preventDefault();

    const {contract} = this.state;
    // console.log(this.state.EmpID);
    const responsee = await contract.methods.details(this.state.EmpID).call();
    console.log(responsee);
    alert("Name: "+responsee[0]+"\nId: "+responsee[1]+"\nLeave Count: "+responsee[2]);
    
  }
  render() {
    if (!this.state.web3) {
      return ("Waiting for injected web3!");
    }
    
    else if(!this.state.adminDone){ 
      return( <InitialPage   accounts = {this.state.accounts} contract = {this.state.contract}/>);
    }
    // eslint-disable-next-line
    else if(this.state.accounts[0] == this.state.adminAdress ){
      return(<AdminPage   accounts = {this.state.accounts} contract = {this.state.contract}/>);
    }
    else {
      return(
        <div className="App">
            <div id="container">
              <div id="header">
                <div id="title">Leave Management System<br></br> Employee Page</div>
              
              <div id="content_panel">
                
                  <div id="heading">Apply Leave<hr size="2" color="#FFFFFF" />
              </div>
              <div id = "special">
              <p>Welcome  <b>{this.state.curName}</b><br></br>
                 Employee ID &nbsp;: <b>{this.state.curID} </b><br ></br>
                 Leaves remaining : <b>{this.state.leavesRemain}</b></p>
                </div>
               {/* <div style="text-align: left;margin-left: 30px;padding-top:8px"><span ><b>Name of Emp. : </b></span><span style="padding-left:25px">{this.state.curName}</span></div>
                <div style="text-align: left;margin-left: 30px;padding-top:8px"><span><b>ID of Emp : </b></span><span style="padding-left:50px">{this.state.curID}</span></div>
                <div style="text-align: left;margin-left: 30px;padding-top:8px"><span><b>No of leave days available : </b></span><span style="padding-left:30px">{this.state.leavesRemain}</span></div> */}
                  <form onSubmit={this.handleAskLeave}>
                    
                    <p>
                      
                      <label for="days" ><span>Apply for leave<span class="required">*</span></span>
                        <input type="text" name="days" id="days" placeholder="Number of Days" required="required" onChange={this.handleleaveDays}/>
                      </label>
                      <label>
                        <input type="submit" value="Apply" />
                      </label>
                      
                    </p>
                    <p>&nbsp; </p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                  </form>
                </div>
              <div id="footer">
                <p><br />&copy; All Rights Reserved.</p>
              </div>
            </div>
        </div>
        </div>
      );
    }
  }
}

export default App;
