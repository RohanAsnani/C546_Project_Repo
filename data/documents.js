import { ObjectId } from "mongodb";
import s3 from '../config/s3-config.js';
import { documents } from "../config/mongoCollections.js";

const exportedMethods = {
    async createDocument(documentInfo, fileBuffer, fileName) {
        if (!fileBuffer || !fileName) {
            throw new Error("File data and file name must be provided.");
        }

        // Generate the S3 key and upload parameters
        const key = `documents/${Date.now()}_${fileName}`;
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: fileBuffer
        };

        try {
            // Upload the file to S3
            const { Location: docUrl } = await s3.upload(params).promise();

            // Prepare the document data to be pushed or created
            const docData = {
                docId: new ObjectId(),  // Adding unique identifier for each document
                type_of_doc: documentInfo.typeOfDoc,
                Doc_url: docUrl,
                Status: documentInfo.status || "Pending",
                SubmittedOn: new Date(),
                approvedby: documentInfo.approvedby ? new ObjectId(documentInfo.approvedby) : null
            };

            // Access the document collection
            const documentCollection = await documents();

            // Update the existing document or create a new one if it does not exist
            const updateResult = await documentCollection.updateOne(
                { Emp_id: documentInfo.empId },
                { $push: { Documents: docData } },
                { upsert: true }
            );

            // Handle the outcome of the update operation
            if (updateResult.matchedCount === 0 && updateResult.upsertedCount === 0) {
                throw new Error("Failed to save document details.");
            }

            console.log("Document uploaded and details saved:", updateResult);
            return {
                success: true,
                documentId: updateResult.upsertedId || documentInfo.empId, // Return upsertedId if a new document was created
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
                // Return an empty array if no documents are found
                return { success: true, documents: [] };
            }
    
            // Map over the Documents array to extract needed details
            const documentsDetails = employeeDocuments.Documents.map(doc => ({
                docId: doc.docId.toString(),  // Ensure the ObjectId is converted to string
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
    
            // Correctly extract the full key from the URL stored in MongoDB
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
    }
    
    




};

export default exportedMethods;
