import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import moment from 'moment'

import "react-datepicker/dist/react-datepicker.css";
import "./css/user.css"

class InitialPage extends Component {

    state = {
        name:"",
        accounts: null,
        contract: null,
        remainingLeaves: 0,
        fromdate: new Date(),
        todate: new Date(),
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
                moment(new Date(Number(myleaves[4][i]))).format("DD/MM/YYYY"),
                moment(new Date(Number(myleaves[5][i]))).format("DD/MM/YYYY")
            ];
            tempArray.push(oo);
        }
        await this.setState({history: tempArray});
        // console.log(this.state.history);
    };

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
                                                <th>From</th>
                                                <th>To</th>
                                                <th>No. of Days</th>
                                                <th>Status</th>
                                                <th>Action</th>

                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.history.map(value => 
                                                <tr>
                                                    <td>
                                                        {value[0].toString()}
                                                    </td>
                                                    <td>
                                                        {value[4].toString()}
                                                    </td>
                                                    <td>
                                                        {value[5].toString()}
                                                    </td>
                                                    
                                                    <td>
                                                        {value[2].toString()}
                                                    </td>
                                                    {this.test(value[3])}
                                                    {this.test2(value[3], value[1])}
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
