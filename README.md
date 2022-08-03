# test_users_bank

Clone this project
```bash
git clone https://github.com/enricfranck/test_usres_bank.git
```
For starting the Backend:

```bash
cd backend
```
```bash
pip3 install -r requirements.txt 
```
```bash
python3 main.py
```

Swagger: http://localhost:8888/api/docs
## Project Layout

```
backend
└── test
└── app
    ├── apis
    │   └── api_v1
    │       └── endpoints
    ├── core    # config
    ├── db      # db models
    ├── crud    # project crud
    ├── models  # project models
    ├── schemas # project schemas
    ├── tests   # pytest
    └── main.py # entrypoint to backend
```
For starting the Frontend:
```bash
cd frontend
```
```bash
yarn install
```
```bash
yarn start
```


Navigate to : http://localhost:3000
```
frontend
└── node_modules
└── public
└── src
    ├── admin
    ├── config  # the api root
    ├── component
    ├── user    
    ├── App.js  
    ├── App.test.js 
    ├── index.css   
```