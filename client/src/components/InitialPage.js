import React, { Component } from 'react';

import "./css/initial.css"

class InitialPage extends Component {

    state = {
        accounts: null,
        contract: null
    };

    componentDidMount = async () => {
        this.setState({accounts: this.props.accounts, contract: this.props.contract});
    };

    handleSetAdmin = async (event) => {
        event.preventDefault();
    
        const { accounts, contract } = this.state;
    
        if(window.confirm("Register Admin?")){
          await contract.methods.makeadmin(event.target.name.value, event.target.name.id).send({ from: accounts[0] });
          window.location.reload();
        }
        else {
          window.location.reload();
        }
    }

    render() {
        return (
            <div class="signup-form">
                <form onSubmit = {this.handleSetAdmin}>
                <h2>Register Admin</h2>
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
        );
  }
}

export default InitialPage;
