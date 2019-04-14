import React, { Component } from 'react';

import "./css/style.css"

class InitialPage extends Component {

    state = {
        accounts: null,
        contract: null
    };

    componentDidMount = async () => {
        this.setState({accounts: this.props.accounts, contract: this.props.contract});
    };

    handleRegisterEmp = async (event) => {  
        event.preventDefault();
  
        const { accounts, contract } = this.state;
  
        if(window.confirm("Register Employee?")){
          // console.log(this.state);
          await contract.methods.register(event.target.address.value, event.target.name.value, event.target.id.value).send({ from: accounts[0] });
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
        const responsee = await contract.methods.details(event.target.id.value).call();
        console.log(responsee);
        alert("Name: "+responsee[0]+"\nId: "+responsee[1]+"\nLeave Count: "+responsee[2]);
        
    }
    handleAskLeave = async (event) => {
        // alert('A name was submitted: ' + this.state.value);
    
        event.preventDefault();
    
        const { accounts, contract } = this.state;
    
        if(window.confirm("Apply for leave")){
         
          await contract.methods.ask_leave(event.target.days.value).send({ from: accounts[0] });
          window.location.reload();
        }
        else {
          window.location.reload();
        }
        
      }

    render() {
        return (
            <div id = "main">
            
                <nav class="navbar navbar-light bg-light  text-center">
                    <span class="navbar-brand mb-0 h1">Leave Management System - Admin Page</span>
                </nav>
                <div class="signup-form">
                    <form  onSubmit = {this.handleRegisterEmp}>
                    <h2>Register Employee</h2>
                        <div class="form-group">
                    <label>Address</label>
                        <input type="text" class="form-control" name="address" required="required"/>
                        </div>
                        <div class="form-group">
                    <label>Name</label>
                        <input type="text" class="form-control" name="name" required="required"/>
                        </div>
                        <div class="form-group">
                    <label>Employee Id</label>
                        <input type="text" class="form-control" name="id" required="required"/>
                        </div>
                    <div class="form-group">
                            <button type="submit" class="btn btn-primary btn-block btn-lg">Register</button>
                        </div>
                    </form>
                </div>

                <div class="signup-form">
                    <form  onSubmit = {this.handleFetchDetails}>
                    <h2>Fetch Details</h2>
                        <div class="form-group">
                    <label>Employee Id</label>
                        <input type="text" class="form-control" name="id" required="required"/>
                        </div>
                    <div class="form-group">
                            <button type="submit" class="btn btn-primary btn-block btn-lg">Fetch</button>
                        </div>
                    </form>
                </div>
               
                <div class="signup-form">
                    <form  onSubmit = {this.handleAskLeave}>
                    <h2>Apply for Leave</h2>
                        <div class="form-group">
                    <label>No. of days  </label>
                        <input type="number" class="form-control" name="days" required="required"/>
                        </div>
                    <div class="form-group">
                            <button type="submit" class="btn btn-primary btn-block btn-lg">Apply</button>
                        </div>
                    </form>
                </div>
            </div>
        );
  }
}

export default InitialPage;
