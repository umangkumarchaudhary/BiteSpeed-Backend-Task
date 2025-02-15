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
