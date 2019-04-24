import React, { Component } from 'react';

import "./css/admin.css"

class InitialPage extends Component {

    state = {
        accounts: null,
        contract: null
    };

    componentDidMount = async () => {
        this.setState({ accounts: this.props.accounts, contract: this.props.contract });
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
        alert("Name: " + responsee[0] + "\nId: " + responsee[1] + "\nLeave Count: " + responsee[2]);

    }
    handleAskLeave = async (event) => {
        // alert('A name was submitted: ' + this.state.value);

        event.preventDefault();

        const { accounts, contract } = this.state;

        if (window.confirm("Apply for leave")) {

            await contract.methods.ask_leave(event.target.days.value).send({ from: accounts[0] });
            window.location.reload();
        }
        else {
            window.location.reload();
        }

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
                                                        <label>No. of days  </label>
                                                        <input type="number" class="form-control" name="days" required="required" />
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
                                                <th>Leave Applied</th>
                                                <th>Action</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>faba;khf</td>
                                                <td>havana ka booba</td>
                                                <td>123
                                                    </td>
                                                <td>5
                                                    </td>
                                                <td><div class="w3-section">
                                                    <button class="btn btn-success btn-small">Accept</button><span>&nbsp;</span>
                                                    <button class="btn btn-danger btn-small">Decline</button>
                                                </div></td>

                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>4</td>
                                                <td class="statusCancelled">&#10008; Cancelled</td>
                                                <td>N/A</td>

                                            </tr>

                                            <tr>
                                                <td>3</td>
                                                <td>5</td>
                                                <td class="statusApproved">&#10004; Approved</td>
                                                <td>N/A</td>

                                            </tr>
                                            <tr>
                                                <td>4</td>
                                                <td>4</td>
                                                <td class="statusApproved">&#10004; Approved</td>
                                                <td>N/A</td>

                                            </tr>
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
