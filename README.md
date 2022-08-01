# test_users_bank

For Starting the project:
```bash
git clone https://github.com/enricfranck/test_usres_bank.git
```
```bash
cd backend
```
```bash
pip3 install -r requirements.txt 
```
```bash
python3 main.py
```
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
