<h1>Xeno: Multi-Tenant Shopify Data Ingestion & Insights Service</h1>

This project is a full-stack, multi-tenant data ingestion and insights service built for Shopify stores. It simulates how a platform like Xeno can onboard different e-commerce businesses, sync their live data, and provide a dashboard to visualize key business metrics.

This repository contains the complete source code for the backend API, the React frontend, and all related documentation.

<br>

<h2>🚀 Key Features</h2>

<ul>
<li><b>Multi-Tenancy:</b> Securely supports multiple stores, each with its own private data, credentials, and dashboard.</li>
<li><b>Live Shopify Sync:</b> Connects to the Shopify Admin API to fetch and ingest live products, customers, orders, and customer events.</li>
<li><b>Sample Data Mode:</b> Includes "Load Sample Data" and "Unload Data" features for quick demonstrations without needing a live store.</li>
<li><b>Secure Authentication:</b> A robust JWT-based authentication system for tenant signup and login.</li>
<li><b>Interactive Dashboard:</b> A dynamic frontend built with React that displays key metrics, charts, and data tables.</li>
</ul>

<br>

<h2>🏗️ Architecture</h2>

The application follows a modern three-tier architecture, with separate, decoupled services for the database, backend, and frontend.

<h3>Architecture Diagram</h3>


![Alt text](../Architecture.png)



<ul>
<li><b>Frontend (React):</b> A single-page application deployed as a Static Site on Render. It handles all user interaction and visualization.</li>
<li><b>Backend (Node.js/Express):</b> A RESTful API server deployed as a Web Service on Render. It manages business logic, database interactions, and communication with the Shopify API.</li>
<li><b>Database (MySQL):</b> A relational database hosted on Railway, managed by the Sequelize ORM.</li>
</ul>

<br>

<h2>🛠️ Setup and Installation (Local)</h2>

To run this project on your local machine, follow these steps.

<h3>Prerequisites</h3>
<ul>
<li>Node.js (v18 or later)</li>
<li>A local MySQL server installed and running.</li>
</ul>

<h3>1. Clone the Repository</h3>
<pre><code>git clone &lt;your-repo-url&gt;
cd &lt;your-repo-folder&gt;</code></pre>

<h3>2. Backend Setup</h3>
<ol>
<li>Navigate to the backend folder:
<pre><code>cd backend</code></pre>
</li>
<li>Create a <code>.env</code> file by copying the example:
<pre><code>cp .env.example .env</code></pre>
</li>
<li>Open the new <code>.env</code> file and fill in your local database credentials (<code>DB_NAME</code>, <code>DB_USER</code>, <code>DB_PASSWORD</code>), a secret for <code>JWT_SECRET</code>, and your Shopify store details.</li>
<li>Install dependencies and start the server:
<pre><code>npm install
npm run dev</code></pre>
The backend server will start on <code>http://localhost:4000</code>.
</li>
</ol>

<h3>3. Frontend Setup</h3>
<ol>
<li>Open a new terminal and navigate to the frontend folder:
<pre><code>cd frontend</code></pre>
</li>
<li>Create a <code>.env</code> file for the frontend:
<pre><code>echo "REACT_APP_API_URL=http://localhost:4000/api" > .env</code></pre>
</li>
<li>Install dependencies and start the application:
<pre><code>npm install
npm start</code></pre>
The frontend will open in your browser at <code>http://localhost:3000</code>. You can now sign up, log in, and use the application.
</li>
</ol>

<br>

<h2>☁️ Deployment</h2>
This project is deployed using Render for the frontend/backend and Railway for the database.

<h3>1. Deploy the Database on Railway</h3>
<ol>
<li>Create a new project on Railway and provision a <b>MySQL</b> database.</li>
<li>Go to the "Connect" tab and copy the <b>Database URL</b>.</li>
</ol>

<h3>2. Deploy the Backend on Render</h3>
<ol>
<li>Create a new <b>Web Service</b> on Render and connect your GitHub repository.</li>
<li>Set the <b>Root Directory</b> to <code>backend</code>.</li>
<li>Set the <b>Start Command</b> to <code>node index.js</code>.</li>
<li>Add the following <b>Environment Variables</b>:
<ul>
<li><code>DATABASE_URL</code>: The URL you copied from Railway.</li>
<li><code>JWT_SECRET</code>: A new, strong, random secret for production.</li>
<li>Your Shopify credentials (<code>SHOPIFY_STORE_DOMAIN</code>, <code>SHOPIFY_ACCESS_TOKEN</code>).</li>
</ul>
</li>
<li>Once deployed, copy the backend's public URL.</li>
</ol>

<h3>3. Deploy the Frontend on Render</h3>
<ol>
<li>Create a new <b>Static Site</b> on Render and connect the same repository.</li>
<li>Set the <b>Root Directory</b> to <code>frontend</code>.</li>
<li>Set the <b>Build Command</b> to <code>npm run build</code>.</li>
<li>Set the <b>Publish Directory</b> to <code>build</code>.</li>
<li>Add the <b>Environment Variable</b>:
<ul>
<li><code>REACT_APP_API_URL</code>: Your backend's URL (e.g., <code>https://www.google.com/search?q=https://your-backend.onrender.com/api</code>).</li>
</ul>
</li>
</ol>

<h3>4. Final CORS Update</h3>
<ol>
<li>Take your live frontend URL from Render.</li>
<li>Add it to the <code>corsOptions</code> in your <code>backend/index.js</code> file.</li>
<li>Commit and push this final change. Render will automatically redeploy the backend.</li>
</ol>

<h3>5. Credentials of 2 shopify stores</h3>
<ol>
<li>1) <code></code>Gmail-katrinakaif@gmail.com | password- katrinakaif </li>code> </li>
<li>2) <code> Gmail - tanisha@gmail.com | password- tanisha </code> </li>

</ol>

<br>

<h2>📄 API Endpoints and DB Schema</h2>

<h3>API Endpoints</h3>
All routes are prefixed with <code>/api</code>. Routes marked with <code>(Protected)</code> require a valid JWT.


| Method   | Endpoint                                   | Description                                       |
|--------- |------------------------------------------- |-------------------------------------------------- |
| `POST`   | `/auth/signup`                             | Create a new tenant account.                      |
| `POST`   | `/auth/login`                              | Log in and receive a JWT.                         |
| `POST`   | `/ingest/products` **(Protected)**         | Ingest sample products.                           |
| `POST`   | `/ingest/customers` **(Protected)**        | Ingest sample customers.                          |
| `POST`   | `/ingest/orders` **(Protected)**           | Ingest sample orders.                             |
| `POST`   | `/ingest/events` **(Protected)**           | Ingest sample custom events.                      |
| `DELETE` | `/ingest/tenant/all-data` **(Protected)**  | Clear all data for the tenant.                    |
| `GET`    | `/shopify/sync/products` **(Protected)**   | Sync products from a live Shopify store.          |
| `GET`    | `/shopify/sync/customers` **(Protected)**  | Sync customers from Shopify.                      |
| `GET`    | `/shopify/sync/orders` **(Protected)**     | Sync orders from Shopify.                         |
| `GET`    | `/dashboard/overview` **(Protected)**      | Get high-level metrics for the dashboard.         |
| `GET`    | `/dashboard/tenant-info` **(Protected)**   | Get the current tenant's name, email, and logo.   |
| `GET`    | `/dashboard/sales-trend` **(Protected)**   | Get data for the sales trend chart.               |
| `GET`    | `/dashboard/top-customers-chart` **(Protected)** | Get data for the top customers chart.             |
| `GET`    | `/dashboard/customer-history` **(Protected)** | Get a detailed history for all customers.         |

<h3>Database Schema</h3>
The database uses a multi-tenant model where data is isolated by a <code>tenantId</code>.

<ul>
  <li><strong>Tenant:</strong> The central table for the multi-tenant system. Each row represents a single store.
    <ul>
      <li>id (Primary Key)</li>
      <li>name, storeUrl, storeDomain, adminEmail, logoUrl (String)</li>
      <li>shopifyAccessToken (String, should be encrypted in production)</li>
      <li>adminPasswordHash (String)</li>
    </ul>
  </li>

  <li><strong>Customer:</strong> Stores customer data, linked to a specific tenant.
    <ul>
      <li>id (Primary Key)</li>
      <li>shopifyId (BigInt)</li>
      <li>email, firstName, lastName (String)</li>
      <li>totalSpent (Decimal)</li>
      <li>tenantId (Foreign Key to Tenant)</li>
      <li>Composite Unique Key on (tenantId, shopifyId)</li>
    </ul>
  </li>

  <li><strong>Product:</strong> Stores product data, linked to a specific tenant.
    <ul>
      <li>id (Primary Key)</li>
      <li>shopifyId (BigInt)</li>
      <li>title, price (String, Decimal)</li>
      <li>tenantId (Foreign Key to Tenant)</li>
      <li>Composite Unique Key on (tenantId, shopifyId)</li>
    </ul>
  </li>

  <li><strong>Order:</strong> Stores order data, linked to a tenant and a customer.
    <ul>
      <li>id (Primary Key)</li>
      <li>shopifyId (BigInt)</li>
      <li>totalPrice (Decimal)</li>
      <li>createdAtShopify (DateTime)</li>
      <li>tenantId (Foreign Key to Tenant)</li>
      <li>customerId (Foreign Key to Customer)</li>
      <li>Composite Unique Key on (tenantId, shopifyId)</li>
    </ul>
  </li>

  <li><strong>OrderItem (Join Table):</strong> Creates the many-to-many relationship between Orders and Products.
    <ul>
      <li>orderId (Foreign Key to Order)</li>
      <li>productId (Foreign Key to Product)</li>
      <li>quantity, price (Integer, Decimal)</li>
    </ul>
  </li>
</ul>

<br>


<br>
<h2>⚖️ Known Limitations & Assumptions</h2>

<ul>
<li><b>Shopify Credentials:</b> For this demo, the Shopify Access Token is stored directly in the database. In a production environment, this sensitive data <b>must</b> be encrypted at rest.</li>
<li><b>Real-time Sync:</b> The current implementation relies on manual "Sync" buttons. A production system would use Shopify Webhooks to receive data in real-time.</li>
<li><b>Data Volume:</b> The current sync process fetches all data at once. A production solution would need to implement pagination to handle large stores with thousands of records.</li>
<li><b>Error Handling:</b> The UI provides general error messages. A production app would have more specific feedback for different types of failures (e.g., invalid API key vs. network error).</li>
</ul>
