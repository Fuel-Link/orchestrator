import datetime as _dt
import sqlalchemy as _sql

import database as _database


class VehicleInfo(_database.Base):
    __tablename__ = "vehicleinfo"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    plate = _sql.Column(_sql.String, index=True, unique=True)
    owner = _sql.Column(_sql.String, index=True)
    fuel = _sql.Column(_sql.String, index=True)
    photo = _sql.Column(_sql.String)
    date_created = _sql.Column(_sql.DateTime, default=_dt.datetime.utcnow)