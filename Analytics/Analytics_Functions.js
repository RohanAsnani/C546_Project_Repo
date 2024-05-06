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