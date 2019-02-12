/*Solidity Smart Contract for Leave Management System
Contributors::
Amit Priyankar(1701CS04)
Ankur Dubey(1701CS07)
Atul Upadhyay(1701CS13)
B.Tech Second Year, IIT Patna
*/
pragma solidity >=0.4.22 <0.6.0;

contract Leave
{
    struct Person
    {
        string name;//name of the person
        string id;// identity card number
        bool available;//if there is chance of taking leave
        uint64 leave_count;//number of leaves taken till date
    }

    uint64 max_leave;//maximum number of leaves that can be taken in a year
    
    address public admin;//the person who can register someone into the database
    
    bool public admindone=false;//checks if admin is there(added later)

    mapping(address=>Person) person;//mapping address to the person
    mapping(address=>bool) registered;//this store if the person is registered in the database
    
    
    mapping(string=>address)emp_details;//added later

    function makeadmin(string memory nname, string memory idd) public
    {
        //following steps are just the registration of admin with all his details
        admin=msg.sender;//registering admin as the sender of the argument to this function
        person[admin].name=nname;
        person[admin].id=idd;
        person[admin].available=true;
        person[admin].leave_count=0;
        registered[admin]=true;
        emp_details[idd]=admin;
        admindone=true;
    }
    function setmaxleave(uint64 count) public//function to set the maximum number of leaves that can be taken
    {
        if(msg.sender!=admin){revert();}
        max_leave=count;
    }
    //function to register a new person to the database
    function register(address toPerson, string memory nname, string memory idd) public
    {
        if(msg.sender!=admin||registered[toPerson]==true){revert();}
        
        person[toPerson].name=nname;
        person[toPerson].id=idd;
        person[toPerson].available=true;
        person[toPerson].leave_count=0;
        registered[toPerson]=true;
        emp_details[idd]=toPerson;
    }
    //function for a person to check number of days available for him to take a leave
    function ask_available() public view returns (uint64 days_available)
    {
        require(registered[msg.sender]==true);
        address temp;
        temp=msg.sender;
        
        days_available=max_leave-person[temp].leave_count;
        //can also return multiple values here if we want to give 
        //any kind of message to the user asking for leave
    }
    
    
    //for this function some special arrangements are to be made to print
    //the message corresponding to the integer reply
    function ask_leave(uint64 count_days) public returns (int8 reply)//function for person to ask leave
    {
        require(registered[msg.sender]==true);
        address temp;
        temp=msg.sender;
    
        //it is to be checked if the person asking for
        //leave is actually registered in the database
        if(person[temp].available==false)reply=0;
        else if(person[temp].leave_count+count_days<=max_leave)
        {
            person[temp].leave_count+=count_days;
            if(person[temp].leave_count==0)person[temp].available=false;
            reply=1;
        }
        else reply=3;
    }

    function details(string memory idd) view public returns (string memory name, string memory id, uint64 leave_count)
    {
        require(msg.sender==admin);
        address temp=emp_details[idd];
        name=person[temp].name;
        id=person[temp].id;
        leave_count=person[temp].leave_count;
    }

    function changeadmin(address newadd) public
    {
        if(msg.sender!=admin)revert();
        require(registered[newadd]==true);
        admin=newadd;
    }
}

/*
to call a function inside another function we can define a library of functions as shown below

pragma solidity ^0.4.13;

contract test {

    uint public fee; 
    function setFee(uint _fee){
      fee = Sf.mul(_fee,10);
    }

}


library Sf{

  function mul(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }


}
*/
<<<<<<< HEAD:contracts/Leave.sol
=======

/*Important bugs to be addressed
1)There must be an option to deregister.
2) leave extension option must be there which needs approval of admin
3)There must be a cap to the maximum number of days of leave that can be taken in one go.
4)need to change the visibilities of various functions

*/
>>>>>>> b7db67bb35a641b288e20e1451f63176b2b326de:contracts/leave.sol
