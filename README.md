# BOUNDEN
Blogs and Services (Webservice - Cross-End Support)

## Examples
- [Blog (Deployed onRender)](https://bounden.onrender.com/)

## Requirements
- Ubuntu (22.04 tested)
- Python3
- NPM
- VS Code or any other code editor

## Project Start Guide
### Clone the repository
```
sudo apt-get install git (check: git --version)
git config --global user.name "******"
git config --global user.email "******"

git clone https://github.com/lujiannan/bounden-frontend.git
```

### Client Setup
- Go to the client directory
- Install npm ```sudo apt install npm```
- Install node.js ```sudo npm cache clean -f && sudo npm install -g n && sudo n stable```
- Check upgrades ```sudo apt upgrade```
- Install the node.js dependencies ```npm install```
- Run the client ```npm start``` (on port 3000 by default)

## Dependencies
- The whole website is built using React as frontend and Flask + Python as backend
- flask_sqlalchemy is used for the database storage
- react-auth-kit and jwt_extended are used for user authentication and token refreshing
- Quill is used for the blog creater/editor
- Render is used for the deployment and hosting of the website

## Deployment
- The website is deployed on Render (https://render.com/)
- The website is hosted on a custom domain (https://bounden.onrender.com/)

## Support
This is an open source project and everyone is welcome to contribute. Feel free to open an issue, if you have any questions or incase you find a bug. Also if you are impressed/inspired by this project, a little credit will be much appreciated.
Created by [Jonas](https://github.com/lujiannan) with ❤️