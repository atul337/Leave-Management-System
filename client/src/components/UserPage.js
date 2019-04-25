import React, { Component } from 'react';

import "./css/user.css"

class InitialPage extends Component {

    state = {
        accounts: null,
        contract: null,
        remainingLeaves: 0
    };

    componentDidMount = async () => {
        await this.setState({accounts: this.props.accounts, contract: this.props.contract});
        let userMap = await this.state.contract.methods.users(this.state.accounts[0]).call();
        this.setState({remainingLeaves: this.props.maxleaves - userMap.days_count});
    };

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
                        <h2 class=" text-white">Welcome <span>UserName</span>!
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        Leaves Remaining:<span>{this.state.remainingLeaves}</span></h2>
                        

                        <span class="loader pull-right"><span class="loader-inner"></span></span>
                        <br></br>


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
                            <div class="panel-heading" role="tab" id="headingThree">
                                <h4 class="panel-title">
                                    <a class="collapsed last" role="button" data-toggle="collapse"
                                        data-parent="#accordion" href="#collapseTwo" aria-expanded="false"
                                        aria-controls="collapseThree">
                                        My Leaves
                                        <span> </span>
                                    </a>
                                </h4>
                            </div>
                            <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel"
                                aria-labelledby="headingThree">
                                <div class="panel-body">

                                    <table>
                                        <thead>
                                            <tr>
                                                <th>S/No.</th>
                                                <th>Leaves Applied</th>
                                                <th>Status</th>
                                                <th>Action</th>

                                            </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>5</td>
                                                    <td class="statusPending">
                                                        <span>Pending</span>
                                                    </td>
                                                    <td>
                                                        <button type="button">Cancel</button>
                                                    </td>

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

                                            <span>Total count</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
  }
}

export default InitialPage;
