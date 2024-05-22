# BOUNDEN
Blogs and Services (Webservice - Cross-End Support)

## Examples
- [Blog (Deployed onRender)](https://bounden.onrender.com/)

## Requirements
- Ubuntu (22.04 tested)
- Python3
- NPM
- VS Code or any other code editor

## Known Issues
- None

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
- Waitress is used for the production server

## Deployment ([Render](https://docs.render.com/github))
- The website is hosted on a custom domain on Render [Provided URL](https://bounden.onrender.com/) [Custom URL](https://render.bounden.cn/)
- Follow the instructions on the Render website to link to the github account
- Create a new static site, link to the frontend repo on github, set name (the prefix of the provided URL), and other details
- Set environment variable to ```REACT_APP_SERVER_URL=<your_backend_deployed_url>```
- Go to your service - 'Redirects/Rewrites' section and add a rule 'source=/*', 'Destination=/index.html', 'Action=Rewrite' [Details](https://docs.render.com/deploy-create-react-app)

## Support
This is an open source project and everyone is welcome to contribute. Feel free to open an issue, if you have any questions or incase you find a bug. Also if you are impressed/inspired by this project, a little credit will be much appreciated.
Created by [Jonas](https://github.com/lujiannan) with ❤️