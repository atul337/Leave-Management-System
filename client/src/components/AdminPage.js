import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import moment from 'moment'

import "react-datepicker/dist/react-datepicker.css";
import "./css/admin.css"

class InitialPage extends Component {

    state = {
        accounts: null,
        contract: null,
        pending: [],
        fromdate: new Date(),
        todate: new Date()
    };

    componentDidMount = async () => {
        await this.setState({ accounts: this.props.accounts, contract: this.props.contract });
        
        const temp = await this.state.contract.methods.toApprove().call();
        // console.log(temp);

        let tempArray = [];
        
        for(var i = 0; i < temp[1].length; ++i){
            let userMap = await this.state.contract.methods.users(temp[2][i]).call();
            let oo = [
                temp[1][i],
                userMap.name,
                userMap.id,
                temp[3][i],
                moment(new Date(Number(temp[4][i]))).format("DD/MM/YYYY"),
                moment(new Date(Number(temp[5][i]))).format("DD/MM/YYYY")
            ];
            tempArray.push(oo);
        }
        await this.setState({pending: tempArray});
        console.log(this.state.pending);
    };


    handleRegisterEmp = async (event) => {
        event.preventDefault();

        const { accounts, contract } = this.state;

        if (window.confirm("Register Employee?")) {
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

        const { contract } = this.state;
        // console.log(this.state.EmpID);
        const responsee = await contract.methods.details(event.target.id.value).call();
        console.log(responsee);
        if(responsee[0])alert("Name: " + responsee[1] + "\nLeaves Remaining: " + responsee[2]);
        else alert("No Employee Found!");

    }

    handleFromDate = async (e) => {
        await this.setState({fromdate: e});
        var now = new Date();
        // console.log(this.state.fromdate.getTime());
        // let x = new Date(this.state.fromdate.getTime());
        // console.log(moment(x).format("DD/MM/YYYY"));
    }
    handleToDate = async (e) => {
        await this.setState({todate: e});
        // console.log(this.state.todate);
    }
    handleAskLeave = async (event) => {
        // alert('A name was submitted: ' + this.state.value);

        event.preventDefault();

        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var days = Math.round(Math.abs((this.state.fromdate.getTime() - this.state.todate.getTime())/(oneDay))) + 1;

        const { accounts, contract } = this.state;
        var now = new Date();
        if(this.state.fromdate.getTime() < now.getTime()){
            alert("Start date should be after today!");
            window.location.reload();
        }
        else if(this.state.fromdate.getTime() >= this.state.todate.getTime()){
            alert("Start date cannot be greater than end date!");
            window.location.reload();
        }
        else if (window.confirm("Apply for leave")) {
            await contract.methods.ask_leave(days, this.state.fromdate.getTime(), this.state.todate.getTime()).send({ from: accounts[0] });
            window.location.reload();
        }
        else {
            window.location.reload();
        }

    }
   
    renderTable = () => {
        return(
            this.state.pending.map(value => 
                <tr>
                    <td>
                        {value[0].toString()}
                    </td>
                    <td>
                        {value[1].toString()}
                    </td>
                    <td>
                        {value[2].toString()}
                    </td>
                    <td>
                        {value[4].toString()}
                    </td>
                    <td>
                        {value[5].toString()}
                    </td>
                    <td>
                        {value[3].toString()}
                    </td>
                    <td><div class="w3-section">
                        <button class="btn btn-success btn-small" onClick = {async () => {
                            await this.state.contract.methods.approve_leave(value[0]).send({ from: this.state.accounts[0] });
                            window.location.reload();
                        }}>
                        Approve
                        </button><span>&nbsp;</span>
                        <button class="btn btn-danger btn-small" onClick = {async () => {
                            await this.state.contract.methods.reject_leave(value[0]).send({ from: this.state.accounts[0] });
                            window.location.reload();
                        }}>
                        
                        Reject
                        
                        </button>
                    </div></td>
                </tr>
            )
        );
    }

    render() {
        return (
            <div id="main">
                <div class="container">
                    <div class="row">
                        <div class="col-md-offset-1 col-md-10">
                            <h2 class=" text-white">Welcome Admin!</h2>
                            <span class="loader pull-right"><span class="loader-inner"></span></span>
                            <br></br>

                            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

                                <div class="panel panel-default">
                                    <div class="panel-heading" role="tab" id="headingThree">
                                        <h4 class="panel-title">
                                            <a class="collapsed last" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseThree">
                                                Register New Employee
                                                <span> </span>
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                                        <div class="panel-body">
                                            <div class="signup-form">
                                                <form onSubmit={this.handleRegisterEmp}>
                                                    <div class="form-group">
                                                        <label>Address</label>
                                                        <input type="text" class="form-control" name="address" required="required" />
                                                    </div>
                                                    <div class="form-group">
                                                        <label>Name</label>
                                                        <input type="text" class="form-control" name="name" required="required" />
                                                    </div>
                                                    <div class="form-group">
                                                        <label>Employee Id</label>
                                                        <input type="text" class="form-control" name="id" required="required" />
                                                    </div>
                                                    <div class="form-group">
                                                        <button type="submit" class="btn btn-primary btn-block btn-lg">Register</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="panel panel-default">
                                    <div class="panel-heading" role="tab" id="headingThree">
                                        <h4 class="panel-title">
                                            <a class="collapsed last" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseThree">
                                                Fetch Details
                                                <span> </span>
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                                        <div class="panel-body">
                                            <div class="signup-form">
                                                <form onSubmit={this.handleFetchDetails}>
                                                    <div class="form-group">
                                                        <label>Employee Id</label>
                                                        <input type="text" class="form-control" name="id" required="required" />
                                                    </div>
                                                    <div class="form-group">
                                                        <button type="submit" class="btn btn-primary btn-block btn-lg">Fetch</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="panel panel-default">
                                    <div class="panel-heading" role="tab" id="headingThree">
                                        <h4 class="panel-title">
                                            <a class="collapsed last" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                Apply for leave
                                                <span> </span>
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                                        <div class="panel-body">
                                            <div class="signup-form">
                                                <form onSubmit={this.handleAskLeave}>
                                                    <div class="form-group">
                                                        <label>&nbsp;From </label>
                                                        <br></br>
                                                        <DatePicker selected={this.state.fromdate} onChange = {this.handleFromDate}/>
                                                        <br></br><br></br>
                                                        <label>&nbsp;To </label>
                                                        <br></br>
                                                        <DatePicker selected={this.state.todate} onChange = {this.handleToDate}/>
                                                    </div>
                                                    <div class="form-group">
                                                        <button type="submit" class="btn btn-primary btn-block btn-lg">Apply</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="panel panel-default">
                                    <div id="temp">
                                        <h4 >
                                            <b>Pending Leave Requests</b>
                                        </h4>
                                </div>

                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Leave ID</th>
                                                <th>Name of Emp.</th>
                                                <th>Employee ID</th>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>No. of days</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {this.renderTable()}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        );
    }
}

export default InitialPage;
