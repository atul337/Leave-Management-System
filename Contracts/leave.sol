/*Important bugs to be addressed
1)In register function if admin registers a person 
who is already registered, then its leave count starts with 0

2) In the ask_leave function, it is to be checked if the person 
asking for leave if actually registered in the database;

3) ask_leave function is to be made more dynamic and interactive
so that if lesser number of leaves are available then it can ask
if the person agrees to take that much of leave
4)On testing this on remix IDE, number of leaves available with admin 
shows up to be 50 all the time, this has to be fixed
*/

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
        address delegate;//an unknown variable


        string name;//name of the person
        uint64 id;// identity card number
        bool available;//if there is chance of taking leave
        uint64 leave_count;//number of leaves taken till date
    }
    uint64 max_leave;//maximum number of leaves that can be taken in a year
    
    address admin;//the person who can register someone into the database
    bool admindone=false;
    
    mapping(address=>Person) person;//mapping address to the person

    function makeadmin(string memory nname, uint64 idd) public
    {
        if(admindone)return;
        //following steps are just the registration of admin with all his details
        admin=msg.sender;//registering admin as the sender of the argument to this function
        person[admin].name=nname;
        person[admin].id=idd;
        person[admin].available=true;
        person[admin].leave_count=0;
        admindone=true;
    }
    function setmaxleave(uint64 count) public//function to set the maximum number of leaves that can be taken
    {
        if(msg.sender!=admin)return;
        max_leave=count;
    }
    //function to register a new person to the database
    function register(address toPerson, string memory nname, uint64 idd) public
    {
        if(msg.sender!=admin)return;
        person[toPerson].name=nname;
        person[toPerson].id=idd;
        person[toPerson].available=true;
        person[toPerson].leave_count=0;
    }
    //function for a person to check number of days available for him to take a leave
    function ask_available() public view returns (uint64 days_available)
    {
        address temp;
        temp=msg.sender;

        //it is to be checked here if the person asking
        //for leave is there in the database
        days_available=max_leave-person[temp].leave_count;
        //can also return multiple values here if we want to give 
        //any kind of message to the user asking for leave
    }
    
    
    //for this function some special arrangements are to be made to print
    //the message corresponding to the integer reply
    function ask_leave(uint64 count_days) public returns (uint8 reply)//function for person to ask leave
    {
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