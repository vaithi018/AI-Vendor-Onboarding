"""
One-time database migration and cleanup script.
Safely removes seeded demo runs from the target database (PostgreSQL or SQLite)
without affecting real vendor onboarding submissions.

Usage:
    # Run against production PostgreSQL:
    DATABASE_URL="postgresql://user:pass@host:port/dbname" python backend/cleanup_demo_data.py

    # Run against local SQLite database:
    python backend/cleanup_demo_data.py
"""

import sys
import os
import logging
from pathlib import Path

# Add backend directory to module search path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.database import engine, SessionLocal, Base
from app.models import VendorRun
from app.config import DATABASE_URL

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("cleanup_demo_data")

DEMO_RUN_IDS = [
    "RUN-20260924-DEMO01",
    "RUN-20260924-DEMO02",
    "RUN-20260924-DEMO03",
    "RUN-20260924-DEMO04",
    "RUN-20260924-DEMO05"
]

def clean_database():
    # Mask credentials for logging
    db_display = DATABASE_URL
    if "@" in db_display:
        prefix, host_part = db_display.split("@", 1)
        scheme = prefix.split("://")[0]
        db_display = f"{scheme}://****:****@{host_part}"

    logger.info(f"Connecting to database: {db_display}")
    
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Find all demo records
        demo_query = db.query(VendorRun).filter(
            (VendorRun.run_id.in_(DEMO_RUN_IDS)) | (VendorRun.run_id.ilike("%DEMO%"))
        )
        
        demo_records = demo_query.all()
        count = len(demo_records)
        
        if count == 0:
            logger.info("No seeded demo records found. Database is clean and contains only real runs.")
        else:
            logger.info(f"Found {count} demo record(s) to remove:")
            for rec in demo_records:
                logger.info(f"  - Deleting Run ID: {rec.run_id} ({rec.company_name})")
            
            deleted = demo_query.delete(synchronize_session=False)
            db.commit()
            logger.info(f"Successfully deleted {deleted} demo record(s).")
            
        remaining_count = db.query(VendorRun).count()
        logger.info(f"Total remaining verified vendor submissions in database: {remaining_count}")
        return count
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error executing cleanup: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    clean_database()
