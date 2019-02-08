var LeaveContract = artifacts.require("./leave.sol");

module.exports = function(deployer) {
  deployer.deploy(LeaveContract);
};
