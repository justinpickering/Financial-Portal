# Introduction

This website is a financial portal to track and visualize your total Networth (assets and liabilities). The website is comprised of various sections for the user to understand the breakdown of their assets and liabilities in dollar values. Users can upload their net worth data to the database in the "Add Entry" section. In this section, users can input data (in dollars, $) for the following:

Assets:
- Investable Assets (Taxable, TFSA, RRSP and other Investable Accounts) 
- Cryptocurrency Assets (Bitcoin, Ethereum and Other)
- Cash Holdings (Hard Cash, Checkings, Savings, and Other Cash Holdings)
- Personal Assets (Principal Residence, Auto, Other Properties and Physical Goods)

Liabilities:
- Mortgages
- Consumer Debt
- Loans
- Other Debt

Once submitted, the data is added as an "entry". The user can visualize the entry in the different sections of the website, with each section providing a detailed breakdown of the category in the form of Insights (totals, pie chart and infographic), Line Chart (of all submitted entries over time) and Data Table (of the last 10 entries. If more than 10 entries, a button appears to direct the user to the "All Entries" section).

The application was built using Django as the backend framework and JavaScript as the frontend programming language. All data is saved in the default database (SQLite)


can be compared to previous entries, and its breakdown can be visualized in "Insights" section  TBD...

# Distinctiveness and Complexity

This financial portal application is distinct from previous course projects because it is not a social network, an e-commerce site or a mailing site. The complexity of this application comes from it being semi-completely dynamic (except for login, register and data entry) as an application that relies heavilty on Javascript for all front-end processes, pulling data from the back-end dynamically via fetch requests for API calls to the backend. Additionally, ChartJS Library was taken advantage to provide a visual interface in the form of a pie and line chart. The charts update dynamically depending on the page that the user is accessing... TBD web responsiveness

# File Contents

- capstone - main project folder

    - finance_portal - main application folder

        - static/finance_portal - contains all static content
            - js.js - script that runs and powers dashboard.html. Fetch API calls incorporated to dynamically update screen with data
            - mobile.js - script to handle mobile menu interaction
            - mychart.js - script that runs in dashboard.html. Interfaces with ChartJS Library for all pie and line charts.
            - style.css - CSS stylesheet for entire application

        - templates/finance_portal - contains all application templates
            - layout.html - base template that dashboard.html extends
            - dashboard.html - main template containing all different views, depending on user selection
            - login.html - form template for user login
            - register.html - form template for user registration

        - admin.py - admin classes added for admin visualization of models
        - apps.py - app name ("finance_portal") configured 
        - models.py - contains two models used in this project. User (with AbstractUser) and Networth for networth asset and liability data
        - urls.py - all application URL paths
        - views.py - application views (backend logic) for database entries, JSON Response (API) and html template registering

    - capstone - django main project folder

    - requirements.txt - list of libraries required to run the application


# How to run

You will need to have a version of python 3 installed. Check this by using the following command:

`py --version`

First, clone the git repo. Open your terminal and navigate to the directory you wish to store the project and run the following commands:

`git clone https://github.com/Jpickzors/CS50WebCapstone.git`

Once the repo is cloned, navigate into the repository:

`cd Capstone`

Create a vitural environment and acitive it using the following commands:

`python3 -m venv venv`
`source venv/bin/activate`

Once you've activated your virtual environment, install the python packages by running:

`pip install -r requirements.txt`

Now, migrate the django project:

`py manage.py migrate`

Finally, to the application open on your server, run:

`py manage.py runserver`