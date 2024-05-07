import { users, boarding } from "../config/mongoCollections.js"
import moment from 'moment';



export async function getTotalEmployees() {
    try {
        const userCollection = await users() 
        let allUsers = await userCollection.find({}).toArray()
        const count = allUsers.length; 
        console.log("Total employees:", count);
        return count;
    } catch (error) {
        throw new Error("Error fetching total employees:", error);
    }
}

export async function getEmployeesByDepartment() {
    try {
        const userCollection = await users(); 
        let departmentCounts = await userCollection.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { _id: 1 } } // Sorting by department name
        ]).toArray();
        console.log("Employees by Department:", departmentCounts);
        return departmentCounts;
    } catch (error) {
        throw new Error("Error fetching employees by department:", error);
    }
}

export async function getAverageTenure() {
    try {
        const userCollection = await users();
        const allUsers = await userCollection.find({ startDate: { $ne: "" } }).toArray(); 
        let totalTenureMonths = 0;
        let count = 0;

        allUsers.forEach(user => {
            if (user.startDate) {
                const startDate = moment(user.startDate);
                const now = moment();
                const tenureMonths = now.diff(startDate, 'months'); 
                totalTenureMonths += tenureMonths;
                count++;
            }
        });

        const averageTenureMonths = count > 0 ? (totalTenureMonths / count).toFixed(2) : 0; 
        console.log("Average Tenure in Months:", averageTenureMonths);
        return averageTenureMonths;
    } catch (error) {
        throw new Error("Error calculating average tenure in months:", error)
    }
}
export async function calculateChurnRate() {
    try {
        const userCollection = await users(); 
        //console.log("User collection accessed.");

        const format = "YYYY-MM-DD";
        const startDateStr = moment().startOf('month').format(format);
        const endDateStr = moment().endOf('month').format(format);
        //console.log("Start date:", startDateStr);
        //console.log("End date:", endDateStr);


        const totalCount = await userCollection.countDocuments({});
        //console.log("Total count of employees:", totalCount);


        const activeCount = await userCollection.countDocuments({
            $or: [
                { endDate: { $gt: endDateStr } }, 
                { endDate: "" },                   
                { endDate: { $exists: false } }   
            ]
        });
        console.log("Active count of employees:", activeCount);

        const leavingCount = await userCollection.countDocuments({
            endDate: { $gte: startDateStr, $lte: endDateStr },
            status: { $in: ["Offboarding", "Inactive"] }
        });
        //console.log("Leaving count:", leavingCount);

 
        const churnRate = totalCount > 0 ? (leavingCount / totalCount) * 100 : 0;
        //console.log("Churn Rate:", churnRate.toFixed(2) + '%');

        return churnRate.toFixed(2) + '%';
    } catch (error) {
        //console.error("Error calculating churn rate:", error);
        throw new Error("Error calculating churn rate:", error);
    }
}




export async function getIncompleteBoardingTasks() {
    try {
        const boardingCollection = await boarding() 
        let tasks = await boardingCollection.find({ "on.completionOn": null }).toArray();
        const incompleteTasks = tasks.map(task => {
            return {
                employeeId: task.employeeId,
                dueDates: task.on.filter(t => !t.completionOn).map(t => t.dueDate)
            };
        });

        console.log("Total incomplete boarding tasks:", incompleteTasks.length);
        console.log("Details:", incompleteTasks);

        return {
            count: incompleteTasks.length,
            details: incompleteTasks
        };
    } catch (error) {
        throw new Error("Error fetching incomplete boarding tasks:", error)
    }
}
export async function getGenderDistribution() {
    try {
        const userCollection = await users(); 
        const genderDistribution = await userCollection.aggregate([
            {
                $group: {
                    _id: "$gender",
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        console.log("Gender Distribution:", genderDistribution);
        return genderDistribution;
    } catch (error) {
        console.error("Error calculating gender distribution:", error);
        throw new Error("Error calculating gender distribution:", error);
    }
}

export async function getVeteranAndDisabilityDistribution() {
    try {
        const userCollection = await users(); 
        const veteranCount = await userCollection.countDocuments({ vet: "Veteran" });
        const disabilityCount = await userCollection.countDocuments({ disability: { $ne: "No" } });
        const totalEmployees = await userCollection.countDocuments({});

        const othersCount = totalEmployees - veteranCount - disabilityCount;

        const distribution = [
            { _id: "Veterans", count: veteranCount },
            { _id: "Employees with Disabilities", count: disabilityCount },
            { _id: "Others", count: othersCount }
        ];

        console.log("Veteran and Disability Distribution:", distribution);
        return distribution;
    } catch (error) {
        console.error("Error calculating veteran and disability distribution:", error);
        throw new Error("Error calculating veteran and disability distribution:", error);
    }
}

export async function getDiversityCount() {
    try {
        const userCollection = await users();
        const diversityCount = await userCollection.aggregate([
            {
                $match: {
                    race: { $ne: "" }  
                }
            },
            {
                $group: {
                    _id: "$race",  
                    count: { $sum: 1 }  
                }
            },
            {
                $sort: {
                    count: -1  
                }
            }
        ]).toArray();
        return diversityCount;
    } catch (error) {
        throw new Error(error);
    }
}
