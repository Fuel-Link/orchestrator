
import database as _database
import models as _models


import database

def _add_tables():
    return database.Base.metadata.create_all(bind=database.engine)

_add_tables()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()





