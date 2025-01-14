# 💖 LoveRoom - Your Special Chat Paradise 💖

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-pink.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-red)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/MUI-v5-ff69b4)](https://mui.com/)
![Version](https://img.shields.io/badge/version-1.0.0-ff1493)

### 💕 A Magical Space Just for Two Special People 💕

</div>

## 🌟 About Our Love Nest 🌟

LoveRoom is your cozy digital paradise where love blooms! 🌸 Share special moments, create beautiful memories, and keep your love story alive in this secure space made just for two! 💑

## ✨ Features that Make Hearts Flutter ✨

### 💌 Sweet Communication
- 💬 Adorable real-time chat interface
- 📸 Share lovely photos and cute videos
- 💝 Express feelings with special reactions
- 🎨 Cute sticker collection

### 🔒 Just For You Two
- 🔐 Super secure private space
- 🎯 End-to-end encrypted messages
- 📱 Protected media sharing
- 🌹 Your private love garden

### 💞 Precious Moments
- 📸 Shared photo collections
- 📅 Special dates reminder
- 🎵 Romantic playlist sharing
- 💌 Digital love letters

### 🎨 Make It Yours
- 🌙 Light/Dark love themes
- 👩‍❤️‍👨 Couple profile options
- 🎪 Fun UI customization
- 🎭 Create your own stickers

## 📚 Complete Installation Guide

### 1. Prerequisites
Before starting your love journey, ensure you have:
- Node.js (>= 14.0.0)
- npm (>= 6.14.0)
- AWS Account
- Git installed

### 2. Setting Up AWS 💝

#### Creating AWS Account
1. Navigate to [AWS Console](https://aws.amazon.com/)
2. Click "Create an AWS Account"
3. Follow the registration process

#### Creating S3 Storage
1. Log into AWS Console
2. Search for "S3" service
3. Click "Create bucket"
4. Choose bucket name (e.g., "loveroom-files")
5. Select your preferred region
6. In access settings:
   - Uncheck "Block all public access"
   - Confirm settings awareness
7. Complete bucket creation

#### Setting Up CORS
Add this to your bucket CORS configuration:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

#### Creating Access Keys
1. Navigate to IAM in AWS Console
2. Go to "Users" → "Add user"
3. Set username: "loveroom-app"
4. Select "Access key - Programmatic access"
5. Attach "AmazonS3FullAccess" policy
6. Save your Access Key ID and Secret Access Key safely

### 3. Project Setup with Love 💕

#### Basic Installation
```bash
# Clone your love nest
git clone https://github.com/scrollDynasty/LoveRoom.git

# Enter the paradise
cd LoveRoom

# Install love packages
npm install
```

#### Environment Configuration
Create `.env` file in your project root:
```env
REACT_APP_AWS_ACCESS_KEY_ID=your_access_key_id
REACT_APP_AWS_SECRET_ACCESS_KEY=your_secret_access_key
REACT_APP_AWS_REGION=your_chosen_region
REACT_APP_AWS_BUCKET_NAME=your_bucket_name
```

#### Storage Security
Add to your S3 bucket permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

### 4. Running Your Love Space 💖

#### Development Mode
```bash
npm start
```
Visit `http://localhost:3000` to see the magic! ✨

#### Production Launch
```bash
npm run build
npm install -g serve
serve -s build
```

### 5. Security Guide 🔒

✨ Essential Security Steps:
- Never share your `.env` file
- Use environment variables in production
- Rotate access keys regularly
- Configure CORS for your domain
- Use minimal permissions
- Regular security updates
- Encrypted data storage

### 6. Troubleshooting Guide 🛠️

#### Upload Issues
- Verify AWS credentials
- Check bucket permissions
- Confirm CORS setup
- Review file size limits

#### Connection Problems
- Check internet connection
- Verify AWS region
- Validate API endpoints

#### Quick Fixes
- Clear browser cache
- Check browser console
- Verify environment setup
- Restart development server

## 💕 Our Love Tech Stack

- 🎨 Frontend: React with love (v18.x)
- 🎭 Styling: SCSS with heart
- 🎪 UI: Material-UI v5
- 🔮 State: Redux Toolkit
- ⚡ Real-time: Socket.IO
- 🗃️ Storage: AWS S3

## 🚀 Coming Soon

✅ Real-time chat is here!
✅ Photo sharing is ready!
✅ Reactions are live!
✅ Themes are done!

🔜 Coming up:
- 🎤 Voice messages
- 📹 Video calls
- 📅 Shared calendar
- ⌛ Memory timeline

## 💝 Help Us Grow

Want to make LoveRoom even better? 🌟

1. 🍴 Fork with love
2. 🌱 Create your feature (`git checkout -b feature/Amazing`)
3. 💝 Commit changes (`git commit -m 'Add something amazing'`)
4. 🌟 Push with care (`git push origin feature/Amazing`)
5. 💫 Open a lovely Pull Request

## 💖 License

Spread love under MIT License! See [LICENSE](LICENSE) 💕

## 💕 Created By

🌟 **scrollDynasty** - *Made with Love* - [GitHub](https://github.com/scrollDynasty)

## 💌 Get in Touch

Share some love:
- 🐛 Issues: [GitHub Issues](https://github.com/scrollDynasty/love-room/issues)
- 📧 Email: scrolldynasty@gmail.com
- 📚 Wiki: [Project Wiki](https://github.com/scrollDynasty/love-room/wiki)

---

<div align="center">

💖 Made with Love by scrollDynasty 💖
<br/>
✨ Last Updated: 2025-01-14 06:34:46 UTC ✨
<br/>
🌟 Spreading Love Since 2025 🌟

</div>

## 🗝️ Login and Password

1. **user1** - `password1`
2. **user2** - `password2`
