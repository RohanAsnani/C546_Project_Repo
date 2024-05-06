import { ObjectId } from "mongodb";
import s3 from '../config/s3-config.js';
import { documents } from "../config/mongoCollections.js";
import { boarding } from "../config/mongoCollections.js"

const exportedMethods = {
    async createDocument(documentInfo, fileBuffer, fileName,taskId = null) {
        if (!fileBuffer || !fileName) {
            throw new Error("File data and file name must be provided.");
        }
        const key = `documents/${Date.now()}_${fileName}`;
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: fileBuffer
        };

        try {
            const { Location: docUrl } = await s3.upload(params).promise();

            const docData = {
                docId: new ObjectId(),
                type_of_doc: documentInfo.typeOfDoc,
                Doc_url: docUrl,
                Status: documentInfo.status || "Pending",
                SubmittedOn: new Date(),
                approvedby: documentInfo.approvedby ? new ObjectId(documentInfo.approvedby) : null,
                TaskId: taskId ? new ObjectId(taskId) : null  // Include the TaskId if provided
            };


            const documentCollection = await documents();

            const updateResult = await documentCollection.updateOne(
                { Emp_id: documentInfo.empId },
                { $push: { Documents: docData } },
                { upsert: true }
            );

            if (updateResult.matchedCount === 0 && updateResult.upsertedCount === 0) {
                throw new Error("Failed to save document details.");
            }

            console.log("Document uploaded and details saved:", updateResult);
            return {
                success: true,
                documentId: updateResult.upsertedId || documentInfo.empId, 
                message: "Document successfully uploaded and registered."
            };

        } catch (error) {
            console.error("Error in creating document:", error);
            throw new Error(`Error creating document: ${error.message}`);
        }
    },
    async getDocumentsByEmployeeId(empId) {
        try {
            const documentCollection = await documents();
            const employeeDocuments = await documentCollection.findOne({ Emp_id: empId });
    
            if (!employeeDocuments || employeeDocuments.Documents.length === 0) {
                return { success: true, documents: [] };
            }
    
            const documentsDetails = employeeDocuments.Documents.map(doc => ({
                docId: doc.docId.toString(),  
                typeOfDoc: doc.type_of_doc,
                submittedOn: doc.SubmittedOn,
            }));
    
            return { success: true, documents: documentsDetails };
        } catch (error) {
            console.error("Error retrieving documents:", error);
            return { success: false, message: `Error retrieving documents: ${error.message}` };
        }
    },
    async getDocumentUrlByDocId(empId, docId) {
        try {
            const documentCollection = await documents();
            const employeeDocuments = await documentCollection.findOne({ Emp_id: empId });
    
            if (!employeeDocuments) {
                return { success: false, message: "No employee with this ID found." };
            }
    
            const document = employeeDocuments.Documents.find(doc => doc.docId.toString() === docId);
            if (!document) {
                return { success: false, message: "Document not found." };
            }
    
            const key = document.Doc_url.replace(/^https?:\/\/[^\/]+\//, ''); // This regex strips the domain
    
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,  // Use the full key
                Expires: 60 * 5 // Link expires in 5 minutes
            };
    
            const preSignedUrl = await s3.getSignedUrlPromise('getObject', params);
            return { success: true, docUrl: preSignedUrl };
        } catch (error) {
            console.error("Error retrieving document URL:", error);
            return { success: false, message: `Error retrieving document URL: ${error.message}` };
        }
    },
    
    async markTaskAsCompleted(empId, taskId) {

        try {
            const boardingCollection = await boarding(); 
            const currentDate = new Date().toISOString().slice(0, 10); 
    
            const updateResult = await boardingCollection.updateOne(
                { 
                    employeeId: empId, 
                    "on._id": new ObjectId(taskId) 
                },
                { 
                    $set: { "on.$.completedOn": currentDate } 
                }
            );
    
            if (updateResult.modifiedCount === 0) {
                console.error("Failed to mark task as completed.");
                return { success: false, message: "Failed to mark task as completed." };
            }
    
            console.log("Task marked as completed:", updateResult);
            return { success: true, message: "Task successfully marked as completed." };
        } catch (error) {
            console.error("Error marking task as completed:", error);
            return { success: false, message: `Error marking task as completed: ${error.message}` };
        }
    },

    async getDocumentUrlByTaskId(empId, taskId) {
        try {
            const documentCollection = await documents();
            const employeeDocument = await documentCollection.findOne({ Emp_id: empId });
    
            if (!employeeDocument || !employeeDocument.Documents) {
                return { success: false, message: "No employee documents found or 'Documents' property is missing." };
            }
    
            let taskIdObj;
            try {
                taskIdObj = new ObjectId(taskId); 
            } catch (error) {
                console.error("Error converting taskId to ObjectId:", error);
                return { success: false, message: "Invalid task ID format" };
            }

            const document = employeeDocument.Documents.find(doc => doc.TaskId && doc.TaskId.equals(taskIdObj));
            if (!document) {
                return { success: false, message: "Document for the specified task not found." };
            }
    
            if (!document.Doc_url) {
                return { success: false, message: "No document URL associated with this task." };
            }
    
            const key = document.Doc_url.replace(/^https?:\/\/[^\/]+\//, ''); // Strip the domain
    
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,  // Use the full key
                Expires: 60 * 5 // Link expires in 5 minutes
            };
    
            const preSignedUrl = await s3.getSignedUrlPromise('getObject', params);
            return { success: true, docUrl: preSignedUrl };
        } catch (error) {
            console.error("Error retrieving document URL for task ID:", error);
            return { success: false, message: `Error retrieving document URL for task ID: ${error.message}` };
        }
    }
    
    

};

export default exportedMethods;


///c hange the return type for the error later