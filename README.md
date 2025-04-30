# Vegan Product Scout (Backend)

## Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Environment Variables
Create a `.env` file in the root directory:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

## Run the Daily Job

```bash
python main.py
```

This will scrape `https://veganz.de/produkte/` and upsert products into your Supabase `products` table.
