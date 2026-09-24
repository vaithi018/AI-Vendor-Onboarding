import os
import tempfile
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Handle Vercel read-only filesystem by storing ephemeral data in /tmp
IS_VERCEL = bool(os.getenv("VERCEL"))
if IS_VERCEL:
    TMP_DIR = Path(tempfile.gettempdir())
    UPLOADS_DIR = TMP_DIR / "uploads"
    DATABASE_DIR = TMP_DIR / "database"
else:
    UPLOADS_DIR = BASE_DIR / "uploads"
    DATABASE_DIR = BASE_DIR / "database"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
DATABASE_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DATABASE_DIR / 'vendor_onboarding.db'}")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
