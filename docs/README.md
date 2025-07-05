# 📚 Outsized Auth API Documentation

This directory contains the API documentation for the Outsized Auth system, designed to be deployed on Netlify.

## 🚀 Deployment on Netlify

### Quick Deploy

1. **Fork or clone this repository**
2. **Connect to Netlify**:

   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select this repository

3. **Configure Build Settings**:

   - **Build command**: Leave empty (not needed for static files)
   - **Publish directory**: `docs`
   - **Node version**: 18 (configured in `netlify.toml`)

4. **Deploy**: Click "Deploy site"

### Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from docs directory
cd docs
netlify deploy --prod --dir=.
```

## 📁 File Structure

```
docs/
├── index.html          # Main Swagger UI interface
├── swagger.yaml        # OpenAPI specification
└── README.md          # This file
```

## 🔧 Configuration

### Netlify Configuration (`netlify.toml`)

The `netlify.toml` file in the root directory configures:

- **Publish directory**: `docs`
- **Redirects**: Multiple paths redirect to the main documentation
- **Headers**: CORS and caching configuration
- **Environment**: Node.js version

### Custom Features

- **Responsive Design**: Works on mobile and desktop
- **JWT Token Management**: Automatically stores and uses JWT tokens
- **Enhanced UI**: Custom styling and branding
- **Loading Animation**: Smooth loading experience
- **Error Handling**: Comprehensive error tracking

## 🌐 Available URLs

Once deployed, your documentation will be available at:

- `https://your-site.netlify.app/` - Main documentation
- `https://your-site.netlify.app/api-docs` - Alternative path
- `https://your-site.netlify.app/docs` - Alternative path
- `https://your-site.netlify.app/swagger` - Alternative path

## 🔄 Updating Documentation

1. **Update `swagger.yaml`** with new API endpoints
2. **Commit and push** to your repository
3. **Netlify automatically deploys** the changes

## 🛠️ Local Development

```bash
# Serve locally for testing
cd docs
python -m http.server 8000
# or
npx serve .

# Open in browser
open http://localhost:8000
```

## 📊 API Endpoints Covered

- **Authentication**: Sign up, sign in, password reset
- **User Management**: Create, fetch, delete users
- **Email Verification**: Webhook integration
- **Health Check**: Service status

## 🔒 Security Features

- **Rate Limiting**: Built-in protection
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Admin and customer roles
- **Input Validation**: Comprehensive validation

## 📞 Support

For issues with the documentation or deployment:

1. Check the [main README](../README.md)
2. Review the [API specification](swagger.yaml)
3. Create an issue in the repository

---

**Deployed with ❤️ on Netlify**
