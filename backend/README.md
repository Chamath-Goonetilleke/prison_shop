# Prison Shop Backend API

This is the backend API for the Prison Shop application. It's built with Node.js, Express, and MySQL.

## Local Development

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file with your database credentials and Cloudinary configuration (use `.env.example` as a template)

3. Start the development server:
   ```
   npm run dev
   ```

## Deploying to Vercel

1. Fork or clone this repository to your own GitHub account

2. Connect your GitHub repository to Vercel

3. Configure the following environment variables in the Vercel dashboard:

   - `DB_HOST`: Your MySQL database host
   - `DB_USER`: Your database username
   - `DB_PASSWORD`: Your database password
   - `DB_NAME`: Your database name
   - `NODE_ENV`: Set to `production`
   - `CLOUD_NAME`: Your Cloudinary cloud name
   - `API_KEY`: Your Cloudinary API key
   - `API_SECRET`: Your Cloudinary API secret

4. Deploy from the Vercel dashboard

## API Endpoints

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a product by ID
- `GET /api/products/category/:categoryId`: Get products by category
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

- `GET /api/categories`: Get all categories
- `GET /api/categories/:id`: Get a category by ID
- `POST /api/categories`: Create a new category
- `PUT /api/categories/:id`: Update a category
- `DELETE /api/categories/:id`: Delete a category

## Notes for Vercel Deployment

- The application uses Cloudinary for image storage, which eliminates the need for file system operations in the serverless environment
- The application uses a MySQL database, which should be hosted separately (e.g., AWS RDS)
- The `vercel.json` file configures routing and environment variables for the deployment

## Cloudinary Configuration

The application uses Cloudinary for image uploads. You'll need to create a Cloudinary account and add the following variables to your `.env` file:

```
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
```

Images are stored in the following Cloudinary folders:

- Product main images: `products/`
- Product additional images: `products/additional/`
- Category images: `categories/`
