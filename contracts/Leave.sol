/*Solidity Smart Contract for Leave Management System
Contributors::
Amit Priyankar(1701CS04)
Ankur Dubey(1701CS07)
Atul Upadhyay(1701CS13)
B.Tech Second Year, IIT Patna
2019
*/
pragma solidity >=0.4.22 <0.6.0;

contract Leave
{
    struct user
    {
        string name;
        string id;
        address account;
        uint leave_count;//no of leaves taken
        uint days_count;//no of days of leaves
        bool exist;
    }//there can be need to store the leave ledger number for the different leaves of an user
    
    struct leavedetail
    {
        address applicant;
        uint dayCount;//number of days in a particular leave
        uint from;
        uint to;
        leavestatus status;
    }

    enum leavestatus
    {
        APPLIED, APPROVED, REJECTED, CANCELLED
    }
    
    address public admin;//address which will be registered first
    bool public adminDone=false;
    uint64 public max_leave = 30;//maximum number of leaves that can be taken in a year

    mapping(address=>user) public users;
    leavedetail[] public leaves;
    mapping(string=>address) fetch;//mapping from employee ID to the address of an employee
    uint reached=0;

    function userExists(address x) public view returns (bool)
    {
        return users[x].exist;
    }

    function approve_leave(uint idx) public returns (bool)
    {
        if(msg.sender!=admin)return false;
        else if (leaves[idx].status!=leavestatus.APPLIED)return false;
        leaves[idx].status=leavestatus.APPROVED;
        return true;
    }

    function reject_leave(uint idx) public returns (bool)
    {
        if(msg.sender!=admin)return false;
        else if (leaves[idx].status!=leavestatus.APPLIED) return false;
        leaves[idx].status=leavestatus.REJECTED;
        users[leaves[idx].applicant].days_count-=leaves[idx].dayCount;
        return true;
    }

    //set admin
    function makeadmin(string memory nname, string memory idd) public returns (bool)
    {
        if(userExists(msg.sender)||adminDone)return false;
        admin=msg.sender;
        fetch[idd]=admin;
        adminDone=true;//admin is now registered
        users[admin]=user({
            name: nname,
            id: idd,
            account: admin,
            leave_count:0, 
            days_count:0,
            exist:true
        });
        return true;
    }

    //register new user
    function register(address useradd, string memory nname, string memory idd) public returns (bool)
    {
        if(msg.sender!=admin||userExists(useradd)||!adminDone)return false;
        fetch[idd]=useradd;
        users[useradd]=user({
            name: nname,
            id:idd, 
            account: useradd, 
            leave_count:0, 
            days_count:0,
            exist:true
        });
    }

    function ask_leave(uint no_of_days, uint from, uint to) public returns (bool)
    {
        require(max_leave - users[msg.sender].days_count >= no_of_days);
        
        leavedetail memory temp;
        temp.applicant=msg.sender;
        temp.dayCount=no_of_days;
        temp.from = from;
        temp.to = to;
        temp.status=leavestatus.APPLIED;
        users[msg.sender].days_count+=no_of_days;
        leaves.push(temp);
        
        users[msg.sender].leave_count++;
        return true;
    }
    function cancelLeave(uint idx) public returns (bool)
    {
        if(msg.sender!=leaves[idx].applicant)return false;
        else if(leaves[idx].status==leavestatus.APPLIED)
        {
            leaves[idx].status=leavestatus.CANCELLED;
            users[msg.sender].days_count-=leaves[idx].dayCount;
            return true;
        }
        else return false;
    }
    // function getAllLeaves() public view returns (bool, address[] memory, uint[] memory, leavestatus[] memory)
    // {
    //     uint size=leaves.length;
        
    //     address[] memory tempAddress=new address[](size);
    //     uint[] memory tempDays = new uint[](size);
    //     leavestatus[] memory tempLeaveStatus= new leavestatus[](size);
        
    //     if(msg.sender!=admin)
    //     {
    //         return (false, tempAddress, tempDays, tempLeaveStatus);
    //     }

    //     for(uint i=0; i<size;i++)
    //     {
    //         tempAddress[i]=leaves[i].applicant;
    //         tempDays[i]=leaves[i].dayCount;
    //         tempLeaveStatus[i]=leaves[i].status;
    //     }
    //     return (true, tempAddress, tempDays, tempLeaveStatus);

    // }
    uint[] tempIndex;
    address[] tempAdd;
    uint[] tempDays;
    uint[] tempfrom;
    uint[] tempto;
    function toApprove() public returns (bool, uint[] memory, address[] memory, uint[] memory, uint[] memory, uint[] memory)
    {
        uint size=leaves.length;
        
        uint[] memory ttempIndex;
        address[] memory ttempAdd;
        uint[] memory ttempDays;
        uint[] memory ttempfrom;
        uint[] memory ttempto;
        
        tempIndex=ttempIndex;
        tempAdd=ttempAdd;
        tempDays=ttempDays;
        tempfrom = ttempfrom;
        tempto = ttempto;
        
        if(msg.sender!=admin)
        {
            return (false, tempIndex, tempAdd, tempDays, tempfrom, tempto);
        }
        bool ok=true;
        for(uint i=reached; i<size;i++)
        {
            if(leaves[i].status==leavestatus.APPLIED)
            {
                ok=false;
                tempIndex.push(i);
                tempAdd.push(leaves[i].applicant);
                // tempName.push(users[leaves[i].applicant].name);
                // tempId.push(users[leaves[i].applicant].id);
                tempDays.push(leaves[i].dayCount);
                tempfrom.push(leaves[i].from);
                tempto.push(leaves[i].to);
                // tempLeaveStatus.push(leaves[i].status);
            }
            else if(ok)reached=i;
        }
        return (true, tempIndex, tempAdd, tempDays, tempfrom, tempto);
    }

    function showLeave(uint i) public view returns (bool, address, uint, leavestatus) 
    {
		uint temp1;
		address temp2;
		if(i>=leaves.length)return (false, temp2, temp1, leavestatus.APPLIED);
		return (true, leaves[i].applicant, leaves[i].dayCount, leaves[i].status);
	}
    
    function getMyLeaves(address add) public view returns (bool, uint[] memory, uint[] memory, leavestatus[] memory, uint[] memory, uint[] memory) 
    {
		uint size = users[add].leave_count;
        uint[] memory ttempIndex = new uint[](size);
		uint[] memory ttempDays = new uint[](size);
		uint[] memory ttempfrom = new uint[](size);
		uint[] memory ttempto = new uint[](size);
		leavestatus[] memory tempLeaveStatus = new leavestatus[](size);
		
        if(size==0)return (false, ttempIndex, ttempDays, tempLeaveStatus, ttempfrom, ttempto);
		uint ct=size-1;
		size = leaves.length;
		for (uint i=0;i<size;i++){
			if(leaves[i].applicant == add)
            {
                ttempIndex[ct]=i;
				// tempAddress[ct]=leaves[i].applicant;
				ttempDays[ct]=leaves[i].dayCount;
				ttempfrom[ct]=leaves[i].from;
				ttempto[ct]=leaves[i].to;
				tempLeaveStatus[ct]=leaves[i].status;
				ct--;	
			}
		}
		return (true, ttempIndex, ttempDays, tempLeaveStatus, ttempfrom, ttempto);
	}//this can be optimisted by using a mapping which stores the indexes of leaves of all the user

    //fetch details of a user
    function details(string memory idd) public view returns (bool, string memory, uint)
    {
        require(msg.sender==admin);
        string memory tempName;
        // uint leaveCount;
        uint daysCount;//number of days remaining
        if(userExists(fetch[idd])!=true)return (false, tempName, daysCount);
        user memory temp=users[fetch[idd]];
        tempName=temp.name;
        // leaveCount=temp.leave_count;
        daysCount= max_leave - temp.days_count;
        return (true, tempName, daysCount);
    }
}
