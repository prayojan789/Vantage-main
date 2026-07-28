"""
NLP service for Vantage — provides lazy-loaded ML models for
aspect-based sentiment analysis (ABSA) on Nepali political text.

Models are loaded on first use (lazy loading) to keep startup fast.
A rule-based fallback ensures the endpoint always returns a result
even if the model cannot be loaded (e.g. no internet access).
"""

import re
import time

# ---------------------------------------------------------------------------
# Lazy-loaded model singletons
# ---------------------------------------------------------------------------

_sentiment_pipeline = None
_model_error = None


def get_sentiment_pipeline():
    """Return the sentiment-analysis pipeline, loading it on first call."""
    global _sentiment_pipeline, _model_error
    if _sentiment_pipeline is not None:
        return _sentiment_pipeline
    if _model_error is not None:
        return None
    try:
        from transformers import pipeline

        _sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment",
        )
        return _sentiment_pipeline
    except Exception as exc:
        _model_error = str(exc)
        return None


# ---------------------------------------------------------------------------
# Political entity dictionary (Nepali English press)
# ---------------------------------------------------------------------------

POLITICAL_ENTITIES = [
    "KP Oli", "K.P. Sharma Oli", "Pushpa Kamal Dahal", "Prachanda",
    "Sher Bahadur Deuba", "Ram Chandra Poudel", "Gagan Thapa",
    "Jhalanath Khanal", "Madhav Kumar Nepal", "Narayana Prasad Koirala",
    "BP Koirala", "Girija Prasad Koirala", "Manmohan Adhikari",
    "Balen Shah", "Rabi Lamichhane", "Anurag Thapa",
    "Nepali Congress", "Congress", "UML", "Maoist", "Maoists",
    "RSP", "Loktantrik", "Janata Samajbadi Party", "JSP",
    "Prime Minister", "PM Office", "Cabinet", "Coalition",
    "Election Commission", "Ministry of Finance", "Ministry of Home Affairs",
    "Home Ministry", "Foreign Ministry", "Supreme Court",
    "Lok Sabha", "House of Representatives", "National Assembly",
    "Kathmandu Valley", "Lalitpur", "Bhaktapur",
    "Nepal Police", "Armed Police Force",
]


# ---------------------------------------------------------------------------
# Entity extraction
# ---------------------------------------------------------------------------

def extract_entities(text):
    """
    Extract political entities from *text* using keyword matching
    against a curated dictionary of Nepali political actors.
    """
    entities = []
    text_lower = text.lower()
    for entity in POLITICAL_ENTITIES:
        if entity.lower() in text_lower:
            entities.append(entity)
    return entities


# ---------------------------------------------------------------------------
# Context extraction
# ---------------------------------------------------------------------------

_SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+")


def _split_sentences(text):
    """Split *text* into sentences using simple punctuation rules."""
    return [s.strip() for s in _SENTENCE_SPLIT.split(text) if s.strip()]


def extract_context(text, entity, window=100):
    """
    Return the sentence (or character window) that contains *entity*.
    Falls back to a character window when no sentence boundary is found.
    """
    for sent in _split_sentences(text):
        if entity.lower() in sent.lower():
            return sent

    idx = text.lower().find(entity.lower())
    if idx == -1:
        return ""
    start = max(0, idx - window)
    end = min(len(text), idx + len(entity) + window)
    return text[start:end]


# ---------------------------------------------------------------------------
# Label mapping
# ---------------------------------------------------------------------------

_LABEL_MAP = {
    "LABEL_0": "negative",
    "LABEL_1": "neutral",
    "LABEL_2": "positive",
    "NEGATIVE": "negative",
    "NEUTRAL": "neutral",
    "POSITIVE": "positive",
    "negative": "negative",
    "neutral": "neutral",
    "positive": "positive",
}


def _map_label(label):
    return _LABEL_MAP.get(label.upper(), "neutral")


# ---------------------------------------------------------------------------
# Rule-based fallback (used when the ML model is unavailable)
# ---------------------------------------------------------------------------

_POSITIVE_WORDS = {
    "success", "progress", "development", "achievement", "win", "victory",
    "improve", "growth", "reform", "positive", "commend", "praise",
    "appreciate", "support", "endorse", "welcome", "laud", "hails",
    "strong", "effective", "efficient", "transparent", "accountable",
}

_NEGATIVE_WORDS = {
    "crisis", "scandal", "corruption", "failure", "problem", "conflict",
    "tension", "controversy", "criticize", "criticism", "criticised",
    "negative", "allegation", "probe", "investigation", "arrest",
    "charge", "convict", "scam", "fraud", "misuse", "embezzle",
    "clash", "row", "rift", "snub", "slam", "blast", "attack",
    "weak", "ineffective", "inefficient", "opaque", "biased",
}


def _rule_based_sentiment(text):
    """Simple lexicon-based sentiment as a fallback."""
    text_lower = text.lower()
    pos = sum(1 for w in _POSITIVE_WORDS if w in text_lower)
    neg = sum(1 for w in _NEGATIVE_WORDS if w in text_lower)
    if pos > neg:
        return "positive", round(0.5 + pos * 0.05, 2)
    if neg > pos:
        return "negative", round(0.5 + neg * 0.05, 2)
    return "neutral", 0.5


# ---------------------------------------------------------------------------
# Main ABSA entry point
# ---------------------------------------------------------------------------

def run_absa(text):
    """
    Run aspect-based sentiment analysis on *text*.

    Returns a dict with:
      - entities: list of {name, sentiment, score, context}
      - overall_sentiment: str
      - processing_ms: int
    """
    start = time.time()

    entities_found = extract_entities(text)
    pipeline = get_sentiment_pipeline()

    results = []
    for entity in entities_found:
        context = extract_context(text, entity)
        if not context:
            continue

        if pipeline is not None:
            try:
                pred = pipeline(context[:512])
                label = pred[0]["label"]
                score = float(pred[0]["score"])
                sentiment = _map_label(label)
                confidence = round(max(0.5, min(0.99, score)), 2)
            except Exception:
                sentiment, confidence = _rule_based_sentiment(context)
        else:
            sentiment, confidence = _rule_based_sentiment(context)

        results.append({
            "name": entity,
            "sentiment": sentiment,
            "score": confidence,
            "context": context,
        })

    if not results:
        results.append({
            "name": "Unidentified Entity",
            "sentiment": "neutral",
            "score": 0.5,
            "context": text[:90] + "...",
        })

    neg = sum(1 for r in results if r["sentiment"] == "negative")
    pos = sum(1 for r in results if r["sentiment"] == "positive")
    overall = "negative" if neg > pos else ("positive" if pos > neg else "neutral")

    return {
        "entities": results,
        "overall_sentiment": overall,
        "processing_ms": int((time.time() - start) * 1000),
    }
