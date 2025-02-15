# **Bitespeed Backend Task: Identity Reconciliation**  

## 📌 Problem Statement  
FluxKart.com wants to enhance customer experience by **identifying and linking customers who use different email addresses or phone numbers** for purchases.  
This is crucial for **personalization, loyalty rewards, and preventing duplicate records.**  

This project implements an **/identify API** that consolidates contact information across multiple purchases and maintains a structured relationship between them.  

---

## 🚀 Solution Approach  

### **1️⃣ Contact Linking Logic**  
- Every contact is stored in a **relational database table**.
- If a new contact shares either an **email** or **phone number** with an existing contact, it is linked to the **oldest (primary) contact**.  
- If no existing contact matches, a **new primary contact** is created.  

### **2️⃣ Handling Multiple Merges**  
- If a request contains an **email from one contact** and a **phone from another**, the two contacts are merged under the **oldest primary contact**.  
- Primary contacts can turn into **secondary contacts** if they are linked to an even older contact.  

### **3️⃣ Consistent Data Representation**  
- The response always returns a **single unified contact structure**, listing all associated emails, phone numbers, and secondary contact IDs.  

---

## 🛠️ How It Works  

### **1️⃣ API Endpoint: `/identify`**  
- **Method:** `POST`  
- **Request Body (JSON):**  
  ```json
  {
    "email": "mcfly@hillvalley.edu",
    "phoneNumber": "123456"
  }

### **Response:**

{
  "contact": {

    "primaryContactId": 1,

    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],

    "phoneNumbers": ["123456"],

    "secondaryContactIds": [23]

  }

}


### **2️⃣ Database Schema (Prisma ORM)**

model Contact {

  id            Int      @id @default(autoincrement())

  phoneNumber   String?  @unique

  email         String?  @unique

  linkedId      Int?     // Links to primary contact

  linkPrecedence String  // "primary" or "secondary"

  createdAt     DateTime @default(now())

  updatedAt     DateTime @updatedAt

  deletedAt     DateTime?

}



### ** 🎯 Scenarios Handled**


New contact (No match found)	A new primary contact is created.

New contact shares email or phone with existing contact	A new secondary contact is created and linked to the primary.

New contact links two existing contacts	The older contact remains primary, and the other gets linked as secondary.

Primary contacts can turn into secondary	If a new link is found to an older primary contact, the existing primary becomes secondary.

Request with already linked contact	No new contact is created; existing relationships are returned.

### **⚙️ Tech Stack**


**Node.js + Express.js 🚀**
**TypeScript for strong typing 🛠️**
**MySQL + Prisma ORM for efficient database management 📊**
**Render for cloud deployment ☁️**
**📦 Setup & Running the Project**


### **1️⃣ Clone the repository:**

git clone https://github.com/your-username/bitespeed-backend.git

cd bitespeed-backend


### **2️⃣ Install dependencies:**

npm install


### **3️⃣ Set up environment variables (.env):**
Create a .env file in the root directory and add:


DATABASE_URL=mysql://user:password@host:port/database
PORT=3000


### **4️⃣ Run database migrations:**

npx prisma migrate dev



### **5️⃣ Start the server:**

npm start

🚀 Deployment (Render)

Since .env is ignored for security reasons, manually add the environment variables in Render’s Environment Settings before deployment.

### **📢 Why This Approach?**
✅ Efficient Linking: Oldest contact remains primary, ensuring data integrity.

✅ Scalability: Uses MySQL and Prisma ORM for robust database handling.

✅ Optimized Queries: Only necessary database lookups and inserts are performed.

✅ Security: .env file ignored; sensitive credentials are kept safe.



### **🎯 Final Thoughts**

This project provides a reliable and scalable solution for customer identity reconciliation. It ensures a seamless experience for businesses needing to track and consolidate customer data efficiently.

**🔥 Happy Coding! 🚀**
