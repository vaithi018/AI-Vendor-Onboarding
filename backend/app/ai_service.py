import logging
from typing import Dict, Any, Optional
from app.config import OPENAI_API_KEY, OPENAI_MODEL

logger = logging.getLogger(__name__)

def generate_ai_insights(
    vendor_data: Dict[str, str],
    deterministic_result: Dict[str, Any],
    document_summaries: Optional[list] = None
) -> Dict[str, Any]:
    """
    Optional AI integration via OpenAI.
    Provides human-readable risk analysis, entity fuzzy match insights, and document analysis.
    Does NOT override deterministic decision logic.
    Gracefully falls back if OPENAI_API_KEY is not set or API call fails.
    """
    if not OPENAI_API_KEY:
        return {
            "ai_enabled": False,
            "status": "SKIPPED",
            "message": "OpenAI API key not configured. Using deterministic verification engine.",
            "entity_similarity_score": None,
            "risk_summary": "Deterministic verification performed standard checks successfully."
        }

    try:
        import openai
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        
        prompt = f"""
You are an expert AI Risk & Compliance Agent for Vendor Onboarding.
Analyze the following vendor submission data and deterministic verification result:

Vendor Data:
- Company Name: {vendor_data.get('company_name')}
- Country: {vendor_data.get('country')}
- Tax ID: {vendor_data.get('tax_id')}
- Bank Account Name: {vendor_data.get('bank_account_name')}
- Bank Name: {vendor_data.get('bank_name')}

Deterministic Decision Result:
- Decision: {deterministic_result.get('decision')}
- Reasons: {deterministic_result.get('reasons')}

Provide a concise JSON response containing:
1. "risk_level": "LOW" | "MEDIUM" | "HIGH"
2. "risk_summary": Brief 2-sentence summary explaining why the vendor received this decision and any potential risk flags.
3. "entity_similarity_note": Comment on company name vs bank account name alignment.
4. "recommendation": Recommended next step for compliance team.

Return ONLY valid JSON.
"""

        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are a vendor compliance assistant. Respond strictly in JSON format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=300
        )

        content = response.choices[0].message.content.strip()
        
        import json
        # Strip markdown formatting if any
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        
        parsed_ai = json.loads(content.strip())
        parsed_ai["ai_enabled"] = True
        parsed_ai["status"] = "SUCCESS"
        return parsed_ai

    except Exception as e:
        logger.warning(f"OpenAI API call failed or failed to parse: {e}")
        return {
            "ai_enabled": True,
            "status": "FALLBACK",
            "message": f"AI enhancement fallback used: {str(e)}",
            "risk_summary": f"Deterministic rules generated final result: {deterministic_result.get('decision')}."
        }
