import React, { Component } from 'react';

import "./css/user.css"

class InitialPage extends Component {

    state = {
        name:"",
        accounts: null,
        contract: null,
        remainingLeaves: 0,
        history: []
    };

    componentDidMount = async () => {
        await this.setState({accounts: this.props.accounts, contract: this.props.contract});

        let userMap = await this.state.contract.methods.users(this.state.accounts[0]).call();
        await this.setState({remainingLeaves: this.props.maxleaves - userMap.days_count, name: userMap.name});

        const myleaves = await this.state.contract.methods.getMyLeaves(this.state.accounts[0]).call();
        // console.log(myleaves);

        let tempArray = [];
        
        for(var i = 0; i < myleaves[1].length; ++i){
            let oo = [
                i+1,  
                myleaves[1][i],
                myleaves[2][i],
                myleaves[3][i],
            ];
            tempArray.push(oo);
        }
        await this.setState({history: tempArray});
        console.log(this.state.history);
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
    test = (val) => {
        if(val == 0)return(
            <td class = "statusPending"><span>Pending</span></td>
        );
        else if(val ==1 )return(<td class = "statusApproved"><span> &#10004; Approved</span></td>);
        else if(val == 2)return <td class = "statusCancelled"><span>&#10008; Rejected</span></td>
        else return <td class = "statusCancelled"><span>&#10008; Cancelled</span></td>
    }
    test2 = (val, ind) => {
        if(val == 0)return(
            <td><button class = "btn btn-danger btn-small" type = "button" onClick = {async () => {
                await this.state.contract.methods.cancelLeave(ind).send({ from: this.state.accounts[0] });
                window.location.reload();
            }}>Cancel</button></td>
        );
        else if(val ==1 )return(<td>N/A</td>);
        else if(val == 2)return <td>N/A</td>
        else return <td>N/A</td>
    }

    render() {
        return (
            <div id="main">
            <div class="container">
                <div class="row">
                    <div class="col-md-offset-1 col-md-10">
                        <h2 class=" text-white">Welcome <span>{this.state.name}</span>!
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
                                            {this.state.history.map(value => 
                                                <tr>
                                                    <td>
                                                        {value[0]}
                                                    </td>
                                                    
                                                    <td>
                                                        {value[2]}
                                                    </td>
                                                    {this.test(value[3])}
                                                    {this.test2(value[3], value[1])}
                                                    
                                                    {/* <td><div class="w3-section">
                                                        <button class="btn btn-success btn-small" onClick = {async () => {
                                                            await this.state.contract.methods.approve_leave(value[0]).send({ from: this.state.accounts[0] });
                                                            window.location.reload();
                                                        }}>
                                                        Accept
                                                        </button><span>&nbsp;</span>
                                                        <button class="btn btn-danger btn-small" onClick = {async () => {
                                                            await this.state.contract.methods.reject_leave(value[0]).send({ from: this.state.accounts[0] });
                                                            window.location.reload();
                                                        }}>
                                                        
                                                        Decline
                                                        
                                                        </button>
                                                    </div></td> */}
                                                </tr>
                                            )}
                                            </tbody>
                                            </table>

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
