import React, { Component } from "react";
import LeaveContract from "./contracts/Leave.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

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
    maxleave:''
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
    const {contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.admindone().call();
    const adminadd = await contract.methods.admin().call();

    // Update state with the result.
    this.setState({ adminDone: response, adminAdress: adminadd });
    // this.handleChange = this.handleChange.bind(this);
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

  handleSetAdmin = async (event) => {
    // alert('A name was submitted: ' + this.state.value);
    event.preventDefault();

    const { accounts, contract } = this.state;

    if(window.confirm("Register Admin?")){
      await contract.methods.makeadmin(this.state.Name, this.state.EmpID).send({ from: accounts[0] });
      window.location.reload();
    }
    else {
      window.location.reload();
    }
  }
  //added by amitpriyankar
  handleRegisterEmp = async (event) => {
    // alert('A name was submitted: ' + this.state.value);

    event.preventDefault();

    const { accounts, contract } = this.state;

    if(window.confirm("Register Employee?")){
      // console.log(this.state);
      await contract.methods.register(this.state.EmpAddress,this.state.Name, this.state.EmpID).send({ from: accounts[0] });
      window.location.reload();
    }
    else {
      window.location.reload();
    }
    
  }

  handleleaveDays = async (event) => {
    this.setState({leaveDays: event.target.value});
    // console.log(this);
  }
 
  handleAskLeave = async (event) => {
    // alert('A name was submitted: ' + this.state.value);

    event.preventDefault();

    const { accounts, contract } = this.state;

    if(window.confirm("Apply for leave")){
     
      await contract.methods.ask_leave(this.state.leaveDays).send({ from: accounts[0] });
      window.location.reload();
    }
    else {
      window.location.reload();
    }
    
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

    const { accounts, contract } = this.state;
    // console.log(this.state.EmpID);
    const responsee = await contract.methods.details(this.state.EmpID).call();
    console.log(responsee);
    alert("Name: "+responsee[0]+"\nId: "+responsee[1]+"\nLeave Count: "+responsee[2]);
    
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    
    else if(!this.state.adminDone){ 
      return(
        <div className="App">
                  <div id="container">
            <div id="header">
              <div id="title">Leave Management System<br></br> Initial Page</div>
            </div>
            
            <div id="content_panel">
              
              <div id="heading">Register Admin<hr size="2" color="#FFFFFF" /> 
          </div>
              <form onSubmit = {this.handleSetAdmin}>
                <p>
                  <label for="full_name" ><span>Name <span class="required">*</span></span>
                    <input type="text" placeholder="Name" required="required" onChange = {this.handleName} />
                  </label>
                  <label for="id"><span>Employee ID<span class="required">*</span></span>
                    <input type="text" placeholder="Employee ID" required="required" onChange = {this.handleEmpID}  />
                  </label>
                  <label>
                    <input type="submit" value="Register" />
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
              <p><br />&copy; Unsullied, All Rights Reserved.</p>
            </div>
          </div>
        </div>
        
      );
    }

    else if(this.state.accounts[0] == this.state.adminAdress ){
      return(
        <div className = "App">
          <div id="container">
              <div id="header">
                <div id="title">Leave Management System<br></br>Admin Page</div>
              </div>
              <div id="content_panel">
                
                <div id="heading">Register Employee<hr size="2" color="#FFFFFF" />
            </div>
                <form onSubmit={this.handleRegisterEmp}>
              
                  <p>
                    <label for="address" ><span>Address <span class="required">*</span></span>
                      <input type="text" name="address" id="address" placeholder="Address" required="required" onChange={this.handleEmpAddress}/>
                    </label>
                    <label for="full_name" ><span>Name <span class="required">*</span></span>
                      <input type="text" name="full_name" id="full_name" placeholder="Name" required="required" onChange={this.handleName}/>
                    </label>
                    <label for="id"><span>Employee ID<span class="required">*</span></span>
                      <input type="text" name="id" id="emp_id" placeholder="Employee ID" required="required" onChange={this.handleEmpID}/>
                    </label>
                    <label>
                      <input type="submit" value="Register" />
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
              
              <div id="content_panel">
                
              <div id="heading">Fetch Details<hr size="2" color="#FFFFFF" />
              </div>
                  <form onSubmit={this.handleFetchDetails}>
                
                    <p>
                      
                      <label for="id"><span>Employee ID<span class="required">*</span></span>
                        <input type="text" name="id" id="emp_id" placeholder="Employee ID" required="required" onChange={this.handleEmpID}/>
                      </label>
                      <label>
                        <input type="submit" value="Fetch" />
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
                
              <div id="content_panel">
                
                  <div id="heading">Apply Leave<hr size="2" color="#FFFFFF" />
              </div>
                  <form onSubmit={this.handleAskLeave}>
                
                    <p>
                      <label for="days" ><span>Number of Days<span class="required">*</span></span>
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
                
                <div id="content_panel">
                
                  <div id="heading">Set Number of Leave that can be taken in  a year<hr size="2" color="#FFFFFF" />
              </div>
                  <form onSubmit={this.handleSetMaxleave}>
                
                    <p>
                      <label for="days" ><span>Number of Days<span class="required">*</span></span>
                        <input type="text" name="days" id="days" placeholder="Number of Days" required="required" onchange={this.handleMaxleave}/>
                      </label>
                      <label>
                        <input type="submit" value="Set" />
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
              <div id="content_panel">
                
                  <div id="heading">Change Admin<hr size="2" color="#FFFFFF" />
              </div>
                  <form onSubmit={this.handleAdminChange}>
                
                    <p>
                      <label for="address" ><span>New Admin Address<span class="required">*</span></span>
                        <input type="text" name="address" id="address" placeholder="Address" required="required" onChange={this.handleNewAdmin}/>
                      </label>
                      <label>
                        <input type="submit" value="Register" />
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
                <p><br />&copy; Unsullied, All Rights Reserved.</p>
              </div>
            </div>
        </div>
      );
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
              <div id = "temp" class = "required">
              </div>
                  <form onSubmit={this.handleAskLeave}>
                    
                    <p>
                      <label for="days" ><span>Number of Days<span class="required">*</span></span>
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
                <p><br />&copy; Unsullied, All Rights Reserved.</p>
              </div>
            </div>
        </div>
        </div>
      );
    }
  }
}

export default App;
