# 🚀 Deployment Guide

This guide covers deployment options for the Outsized Auth system, including both the API (AWS Lambda) and documentation (Netlify).

## 📋 Prerequisites

- **Node.js 16+**
- **Git** installed and configured
- **AWS Account** (for API deployment)
- **Netlify Account** (for documentation)
- **Serverless Framework** (`npm install -g serverless`)

## 🔐 API Deployment (AWS Lambda)

### 1. AWS Setup

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit with your values
nano .env
```

Required environment variables:

```env
# Database
DB_HOST=your-mysql-host.com
DB_DATABASE=outsized_auth
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# Redis
REDIS_URL=redis://your-redis-host:6379

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
```

### 3. Deploy to AWS

```bash
# Install dependencies
npm install

# Deploy to production
npm run deploy:prod

# Deploy to development
npm run deploy:dev

# Deploy to staging
npm run deploy:staging
```

### 4. Verify Deployment

```bash
# Check health endpoint
curl https://your-api-gateway-url/prod/health

# View logs
npm run logs:prod
```

## 📚 Documentation Deployment (Netlify)

### Option 1: Automatic Deployment (Recommended)

1. **Fork/Clone Repository**

   ```bash
   git clone https://github.com/your-username/outsized-auth.git
   cd outsized-auth
   ```

2. **Connect to Netlify**

   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select this repository

3. **Configure Build Settings**

   - **Build command**: Leave empty
   - **Publish directory**: `docs`
   - **Node version**: 18

4. **Deploy**
   - Click "Deploy site"
   - Your site will be available at `https://your-site.netlify.app`

### Option 2: Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy documentation
npm run docs:deploy

# Or deploy manually
cd docs
netlify deploy --prod --dir=.
```

### Option 3: Using npm Scripts

```bash
# Preview deployment
npm run docs:preview

# Production deployment
npm run docs:deploy

# Serve locally
npm run docs:serve
```

## 🔧 Configuration Files

### `netlify.toml`

```toml
[build]
  publish = "docs"
  command = ""

[[redirects]]
  from = "/"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

### `serverless.yml`

```yaml
service: outsized-auth
provider:
  name: aws
  runtime: nodejs18.x
  region: ap-south-1
  stage: ${opt:stage, 'prod'}
```

## 🌐 Custom Domains

### Netlify Custom Domain

1. **Add Custom Domain**

   - Go to Site settings > Domain management
   - Click "Add custom domain"
   - Enter your domain (e.g., `api-docs.yourdomain.com`)

2. **Configure DNS**
   - Add CNAME record pointing to your Netlify site
   - Or use Netlify DNS for automatic configuration

### AWS API Gateway Custom Domain

1. **Create Custom Domain**

   ```bash
   aws apigateway create-domain-name \
     --domain-name api.yourdomain.com \
     --regional-certificate-arn your-certificate-arn
   ```

2. **Configure DNS**
   - Add A record pointing to API Gateway
   - Or use Route 53 for automatic configuration

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - run: npm run deploy:prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

  deploy-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: "./docs"
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📊 Monitoring

### AWS CloudWatch

```bash
# View function logs
npm run logs:prod --tail

# Check specific function
serverless logs --function sign-up --stage prod
```

### Netlify Analytics

- Go to Site settings > Analytics
- Enable analytics for traffic insights
- Monitor build times and deployment status

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**

   ```bash
   # Check build logs
   netlify logs --site your-site-id

   # Test locally
   npm run docs:serve
   ```

2. **API Gateway Issues**

   ```bash
   # Validate serverless config
   serverless validate

   # Check deployment status
   serverless info --stage prod
   ```

3. **Environment Variables**

   ```bash
   # Verify environment setup
   serverless print --stage prod

   # Check Netlify environment
   netlify env:list
   ```

### Debug Commands

```bash
# Test API locally
npm run dev

# Test documentation locally
npm run docs:serve

# Check serverless configuration
serverless print --stage prod

# Validate OpenAPI spec
npx swagger-cli validate docs/swagger.yaml
```

## 🔒 Security Considerations

### Environment Variables

- Never commit `.env` files
- Use AWS Secrets Manager for sensitive data
- Rotate JWT secrets regularly

### CORS Configuration

- Configure allowed origins in API Gateway
- Use environment-specific CORS settings
- Monitor for unauthorized requests

### Rate Limiting

- Monitor rate limit violations
- Adjust limits based on usage patterns
- Set up alerts for abuse detection

## 📞 Support

- **Documentation**: [API Docs](https://your-site.netlify.app)
- **Issues**: Create an issue in the repository
- **AWS Support**: Use AWS support channels
- **Netlify Support**: Use Netlify support channels

---

**Happy Deploying! 🚀**
