import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // Middleware to parse JSON requests

// ✅ Identity Reconciliation Endpoint
app.post("/identify", async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, phoneNumber } = req.body;

        // Validate input
        if (!email && !phoneNumber) {
            return res.status(400).json({ error: "At least one of email or phoneNumber must be provided." });
        }

        // Fetch all contacts that match either email or phoneNumber
        const existingContacts = await prisma.contact.findMany({
            where: {
                OR: [{ email }, { phoneNumber }],
            },
            orderBy: { createdAt: "asc" }, // Oldest contact first
        });

        if (existingContacts.length === 0) {
            // Create a new primary contact if no existing records are found
            const newContact = await prisma.contact.create({
                data: { email, phoneNumber, linkPrecedence: "primary" },
            });

            return res.json({
                contact: {
                    primaryContactId: newContact.id,
                    emails: email ? [email] : [],
                    phoneNumbers: phoneNumber ? [phoneNumber] : [],
                    secondaryContactIds: [],
                },
            });
        }

        // Determine the primary contact (oldest record)
        let primaryContact = existingContacts.find(c => c.linkPrecedence === "primary") || existingContacts[0];

        // Gather linked emails, phone numbers, and secondary contacts
        const emails = new Set<string>();
        const phoneNumbers = new Set<string>();
        const secondaryContactIds: number[] = [];

        for (const contact of existingContacts) {
            if (contact.email) emails.add(contact.email);
            if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
            if (contact.id !== primaryContact.id) {
                secondaryContactIds.push(contact.id);
            }
        }

        // If a new unique email or phone is provided, create a secondary contact
        if (!emails.has(email) || !phoneNumbers.has(phoneNumber)) {
            const newSecondaryContact = await prisma.contact.create({
                data: {
                    email,
                    phoneNumber,
                    linkedId: primaryContact.id,
                    linkPrecedence: "secondary",
                },
            });
            secondaryContactIds.push(newSecondaryContact.id);
            if (email) emails.add(email);
            if (phoneNumber) phoneNumbers.add(phoneNumber);
        }

        // Response with consolidated contact details
        return res.json({
            contact: {
                primaryContactId: primaryContact.id,
                emails: Array.from(emails),
                phoneNumbers: Array.from(phoneNumbers),
                secondaryContactIds,
            },
        });
    } catch (error) {
        console.error("Error handling /identify:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Server Start
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
